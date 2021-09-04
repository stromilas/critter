from .authentication import authenticate

auth = authenticate()
auth_optional = authenticate(required=False)