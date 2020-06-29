# zmienne użyte w środowisku produkcyjnym

# zmienne zabezpieczające aplikację
# terminacja tls odbywa się po stronie nginx, zatem nie ma sensu
# ustawiać cokolwiek dla ssl
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
