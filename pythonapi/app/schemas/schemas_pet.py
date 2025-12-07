# schemas_pet.py
# Pydantic schemas for pet validation

from pydantic import BaseModel, Field, constr, conint, ConfigDict
from typing import Optional

# Base schema with shared pet fields
class PetBase(BaseModel):
    name: constr(min_length=2, max_length=120)
    species: constr(min_length=2, max_length=80)
    age: conint(ge=0, le=50)
    description: Optional[str] = Field(default=None, max_length=1000)
    location_id: int

# Schema for creating new pets
class PetCreate(PetBase): pass

# Schema for pet API responses
class PetOut(PetBase):
    pet_id: int
    photo_url: Optional[str] = None
    status: str
    model_config = ConfigDict(from_attributes=True)