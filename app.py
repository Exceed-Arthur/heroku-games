
from waitress import serve


from website.views import app

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=3000)