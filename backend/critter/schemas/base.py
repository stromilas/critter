from pydantic import BaseModel

class CoreModel(BaseModel):
    class Config:
        orm_mode = True

    @classmethod
    def from_core(cls, keys, row):
        keys = tuple(keys)
        return cls(**dict(zip(keys, row)))