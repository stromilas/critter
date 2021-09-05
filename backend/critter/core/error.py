import traceback

def error(exc):
    print(traceback.print_exception(type(exc), exc, exc.__traceback__))
