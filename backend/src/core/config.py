from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List, Union, Any
from pydantic import computed_field, field_validator
class Settings(BaseSettings):
    # DATABASE CONFIGURATION
    DATABASE_URL: Optional[str] = None
    
    # API CONFIGURATION
    API_VERSION: str = "/api/v1"
    ELEXON_BMRS_BASE_URL: str = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

    @computed_field
    def ELEXON_BMRS_FUELHH_URL(self) -> str:
        return f"{self.ELEXON_BMRS_BASE_URL}/FUELHH/stream"

    @computed_field
    def ELEXON_BMRS_WINDFOR_URL(self) -> str:
        return f"{self.ELEXON_BMRS_BASE_URL}/WINDFOR/stream"

    # CORS CONFIGURATION
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # DEBUG CONFIGURATION
    DEBUG: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()