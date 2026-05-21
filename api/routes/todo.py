from fastapi import APIRouter, HTTPException
from api.models.todo import Todo
from api.schemas import GetTodo, CreateTodo, PutTodo

todo_router = APIRouter(prefix="/todos", tags=["todos"])

@todo_router.get("/")
async def all_todos():
    data = Todo.all()
    return await GetTodo.from_queryset(Todo.all())

@todo_router.post("/")
async def create_todo(body: CreateTodo):
    # body.dict() converts the Pydantic model instance to a dictionary, 
    # which can be unpacked into keyword arguments using **. 
    # exclude_unset=True ensures that only fields that were explicitly 
    # set in the request body are included in the dictionary, allowing for 
    # default values to be used for any fields that were not provided.
    row = await Todo.create(**body.dict(exclude_unset=True))
    return await GetTodo.from_tortoise_orm(row)

@todo_router.put("/{todo_id}")
async def update_todo(todo_id: int, body: PutTodo):
    data = body.dict(exclude_unset=True)
    exists = await Todo.filter(id=todo_id).exists()
    if not exists:
        raise HTTPException(status_code=404, detail="Todo not found")
    await Todo.filter(id=todo_id).update(**data)
    return await GetTodo.from_queryset_single(Todo.get(id=todo_id))

@todo_router.delete("/{todo_id}")
async def delete_todo(todo_id: int):
    exists = await Todo.filter(id=todo_id).exists()
    if not exists:
        raise HTTPException(status_code=404, detail="Todo not found")
    await Todo.filter(id=todo_id).delete()
    return "Todo deleted successfully"