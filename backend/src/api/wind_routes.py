from fastapi import APIRouter, Depends

router = APIRouter(prefix="/wind-energy", tags=["Wind Generation"])

@router.get("/")
def get_wind_energy_detail():
    pass