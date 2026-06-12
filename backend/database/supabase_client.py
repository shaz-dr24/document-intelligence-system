from supabase import create_client
from config.settings import *

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)