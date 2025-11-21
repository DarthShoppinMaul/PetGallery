"""
Authentication Endpoints
------------------------
API endpoints for user authentication (login, logout, registration, Google OAuth).
Handles session management using JWT tokens and password hashing for security.

Routes:
    - POST /auth/login: User login (returns JWT)
    - POST /auth/logout: User logout
    - POST /auth/register: New user registration (returns JWT)
    - GET /auth/me: Get current user info (requires JWT)
    - GET /auth/status: API health check
    - GET /auth/google/login: Initiate Google OAuth flow
    - GET /auth/google/callback: Handle Google OAuth callback
"""

from fastapi import APIRouter, HTTPException, Response, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from app.db import get_db
from app.schemas.models import User
from app.schemas.schemas_auth import LoginRequest, RegisterRequest, UserOut
from app import config
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/auth", tags=["auth"])

# JWT Configuration
JWT_SECRET = config.MY_SECRET_KEY
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 1
JWT_REMEMBER_ME_DAYS = 7

# Configure OAuth for Google - use Starlette's Config for proper initialization
starlette_config = Config(environ={
    'GOOGLE_CLIENT_ID': config.GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': config.GOOGLE_CLIENT_SECRET,
})

oauth = OAuth(starlette_config)
oauth.register(
    name='google',
    client_id=config.GOOGLE_CLIENT_ID,
    client_secret=config.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(data: dict, remember_me: bool = False) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary with user data to encode
        remember_me: If True, token expires in 7 days, else 1 hour

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if remember_me:
        expire = datetime.utcnow() + timedelta(days=JWT_REMEMBER_ME_DAYS)
    else:
        expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def get_token_from_request(request: Request) -> Optional[str]:
    """
    Extract JWT token from request.
    Checks Authorization header and also cookies for backward compatibility.

    Returns:
        Token string or None
    """
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]

    return request.cookies.get("access_token")


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """
    Get the currently authenticated user from JWT token.

    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = get_token_from_request(request)

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_auth(request: Request):
    """Dependency to require authentication."""
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Login required")


@router.get("/status")
def auth_status():
    """
    API Health Check
    ----------------
    Simple endpoint to check if the authentication API is running.
    Used by Cypress tests to ensure API server is available.

    Returns:
        Status message indicating API is operational
    """
    return {"status": "ok", "message": "Authentication API is running"}


@router.post("/login", response_model=UserOut)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    User Login
    ----------
    Authenticate a user with email and password.
    Returns JWT token in both response body and httpOnly cookie.

    Args:
        data: Login credentials (email, password, remember_me)
        response: FastAPI response object
        db: Database session

    Returns:
        User object with access token

    Raises:
        HTTPException 401: Invalid credentials
    """
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token
    remember_me = getattr(data, 'remember_me', False)
    access_token = create_access_token(
        data={"sub": user.email},
        remember_me=remember_me
    )

    # Set token in httpOnly cookie for browser
    max_age = 60 * 60 * 24 * 7 if remember_me else 60 * 60 * 24
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        samesite="lax",
        max_age=max_age
    )

    # Return user data with token
    user_out = UserOut(
        user_id=user.user_id,
        email=user.email,
        display_name=user.display_name,
        is_admin=user.is_admin,
        created_at=user.created_at
    )

    return {**user_out.dict(), "access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserOut)
def register(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    """
    User Registration
    -----------------
    Create a new user account and return JWT.

    Args:
        data: Registration data (email, password, display_name)
        response: FastAPI response object
        db: Database session

    Returns:
        User object with access token

    Raises:
        HTTPException 400: Email already registered
    """
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        display_name=data.display_name,
        is_admin=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT token
    access_token = create_access_token(data={"sub": new_user.email})

    # Set token in httpOnly cookie
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24
    )

    # Return user data with token
    user_out = UserOut(
        user_id=new_user.user_id,
        email=new_user.email,
        display_name=new_user.display_name,
        is_admin=new_user.is_admin,
        created_at=new_user.created_at
    )

    return {**user_out.dict(), "access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response):
    """
    User Logout
    -----------
    Clear the JWT token cookie.

    Args:
        response: FastAPI response object

    Returns:
        Success message
    """
    response.delete_cookie("access_token")
    return {"ok": True, "message": "Logged out successfully"}


@router.get("/me", response_model=UserOut)
def me(request: Request, db: Session = Depends(get_db)):
    """
    Get Current User
    ----------------
    Retrieve information about the currently logged-in user.

    Args:
        request: FastAPI request object
        db: Database session

    Returns:
        User object

    Raises:
        HTTPException 401: Not authenticated
    """
    return get_current_user(request, db)


@router.get("/google/login")
async def google_login(request: Request):
    """
    Google OAuth Login
    ------------------
    Initiates the Google OAuth flow.

    Args:
        request: FastAPI request object

    Returns:
        Redirect to Google OAuth authorization

    Raises:
        HTTPException 500: Google OAuth not configured
    """
    if not config.GOOGLE_CLIENT_ID or not config.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in googleauth.env"
        )

    # Use the backend callback URL (not frontend)
    redirect_uri = "http://localhost:8000/auth/google/callback"

    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """
    Google OAuth Callback
    ---------------------
    Handles the callback from Google after user authorizes.
    Creates or finds user, generates JWT, and redirects to frontend.

    Args:
        request: FastAPI request object
        db: Database session

    Returns:
        Redirect to frontend with JWT cookie set

    Raises:
        Redirects to login page on error
    """
    try:
        # Get the access token from Google
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')

        if not user_info:
            print("Error: No user info returned from Google")
            return RedirectResponse(url="http://localhost:5173/login?error=oauth_failed")

        email = user_info.get('email')
        display_name = user_info.get('name', email.split('@')[0] if email else 'User')

        if not email:
            print("Error: No email provided by Google")
            return RedirectResponse(url="http://localhost:5173/login?error=oauth_failed")

        print(f"Google OAuth: Processing login for {email}")

        # Find or create user
        user = db.query(User).filter(User.email == email).first()

        if not user:
            # Create new user with random password (they'll use Google to login)
            import secrets
            random_password = secrets.token_urlsafe(32)

            user = User(
                email=email,
                password_hash=hash_password(random_password),
                display_name=display_name,
                is_admin=False  # New Google users are not admins by default
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created new user via Google OAuth: {email}")
        else:
            print(f"Found existing user: {email}")

        # Create JWT token with 7-day expiration for Google OAuth users
        access_token = create_access_token(
            data={"sub": user.email},
            remember_me=True  # Google OAuth users get 7-day tokens
        )

        # Create redirect response to frontend
        response = RedirectResponse(url="http://localhost:5173/pets")

        # Set JWT in httpOnly cookie
        response.set_cookie(
            "access_token",
            access_token,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 7,  # 7 days
            secure=False  # Set to True in production with HTTPS
        )

        print(f"Google OAuth successful for {email}, redirecting to /pets")
        return response

    except Exception as e:
        print(f"Google OAuth error: {str(e)}")
        import traceback
        traceback.print_exc()
        return RedirectResponse(url="http://localhost:5173/login?error=oauth_failed")