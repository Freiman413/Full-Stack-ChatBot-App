from fastapi import APIRouter 
from vallidation.text_vall import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from service.auth_service import register, login

router =APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterResponse)
def register_endpoint(request: RegisterRequest):
    user_id =register(request.email, request.password)
    return RegisterResponse(message="User registered successfully", user_id=user_id)

@router.post("/login", response_model=LoginResponse)
def login_endpoint(request: LoginRequest):
    token = login(request.email, request.password)
    return LoginResponse(access_token = token, token_type = "bearer")