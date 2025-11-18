"""
Location Management Endpoints
-----------------------------
API endpoints for managing pet adoption locations.
Handles location CRUD operations for shelters and facilities.

Routes:
    - GET /locations: List all locations
    - POST /locations: Create new location
    - PUT /locations/{location_id}: Update existing location
    - DELETE /locations/{location_id}: Delete location
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db  # Database session dependency
from app.schemas.schemas_location import LocationCreate, LocationOut  # Pydantic schemas for locations
from app.schemas.models import Location  # Location database model
from sqlalchemy import func

# Create API router with /locations prefix
router = APIRouter(prefix="/locations", tags=["locations"])


@router.get("", response_model=list[LocationOut])
def list_locations(db: Session = Depends(get_db)):
    """
    List All Locations
    ------------------
    Returns all adoption locations, sorted alphabetically by name.

    Returns:
        List[LocationOut]: List of all locations

    Note:
        Uses case-insensitive sorting for consistent alphabetical order.
    """
    return db.query(Location).order_by(func.lower(Location.name).asc()).all()


@router.post("", response_model=LocationOut, status_code=200)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    """
    Create New Location
    -------------------
    Create a new adoption location/shelter.

    Args:
        payload: Location data (name, address, phone)

    Returns:
        LocationOut: Created location object

    Note:
        Phone number defaults to empty string if not provided.
        All locations are immediately available for associating with pets.
    """
    data = payload.model_dump()
    data["phone"] = data.get("phone") or ""  # Ensure phone is never None

    # Create and save new location
    obj = Location(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{location_id}", response_model=LocationOut)
def update_location(location_id: int, payload: LocationCreate, db: Session = Depends(get_db)):
    """
    Update Location
    ---------------
    Update an existing adoption location/shelter.

    Args:
        location_id: ID of the location to update
        payload: Updated location data (name, address, phone)

    Returns:
        LocationOut: Updated location object

    Raises:
        HTTPException 404: Location not found

    Note:
        All fields in the payload will replace existing values.
        Phone number defaults to empty string if not provided.
    """
    # Find the location
    location = db.query(Location).filter(Location.location_id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Update fields
    data = payload.model_dump()
    data["phone"] = data.get("phone") or ""  # Ensure phone is never None

    for key, value in data.items():
        setattr(location, key, value)

    # Save changes
    db.commit()
    db.refresh(location)
    return location


@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    """
    Delete Location
    ---------------
    Permanently delete a location from the database.

    Args:
        location_id: ID of the location to delete

    Returns:
        dict: Success confirmation

    Raises:
        HTTPException 404: Location not found
        HTTPException 400: Location is in use by pets

    Note:
        Cannot delete a location that has pets assigned to it.
        This prevents orphaned pet records.
    """
    # Find the location
    location = db.query(Location).filter(Location.location_id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # Check if any pets are using this location
    from app.schemas.models import Pet
    pets_count = db.query(Pet).filter(Pet.location_id == location_id).count()
    if pets_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete location. {pets_count} pet(s) are assigned to this location."
        )

    # Delete location
    db.delete(location)
    db.commit()
    return {"ok": True, "message": "Location deleted successfully"}
