from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config =SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

    OLLAMA_MODEL: str = "tinyllama"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    MONGODB_URI: str = "mongodb://localhost:27017"
    SECRET_KEY: str = "super-secret-key-change-me"
    ALGORITHM: str = "HS256"
    REDIS_URL: str = "redis://localhost:6379"
settings = Settings()

