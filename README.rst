=====
 FTP
=====

Quick start
-----------

1. Add "upload_form" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        'upload_form',    **top of the list**
        'django.contrib.sites',  **if you don't have**
        ...
    ]
2. Add settings below to your settings.py
   
    /////////////////////////////////////////////////

SITE_ID = 1

AUTHENTICATION_BACKENDS = (
              'django.contrib.auth.backends.ModelBackend',
)
LOGIN_REDIRECT_URL ='/home'
LOGIN_URL = "/login/"

MEDIA_ROOT = os.path.join(BASE_DIR,'uploads')
MEDIA_URL = '/uploads/'  

STATIC_URL = '/static/'  

DEFAULT_FROM_EMAIL = '**EMAIL FROM**'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = **PUT YOUR SETTING**
EMAIL_HOST_USER = **PUT YOURS SETTING**
EMAIL_HOST_PASSWORD =**PUT YOURS SETTING**
EMAIL_PORT = **PUT YOURS SETTING**
EMAIL_USE_TLS = True

    /////////////////////////////////////////////////

3. Include the upload URLconf in your project urls.py like this::

    url(r'^', include('upload_form.urls',namespace='upload_form')),
    url('^', include('django.contrib.auth.urls'))

4. Run `python manage.py migrate` to create the upload_form models.

5. Run `python manage.py createsuperuser` to create admin(email required).

6. Start the development server and visit /admin
   (you'll need the Admin app enabled).

7. Open "Sites" model and change "example.com" to your domain.
   (for development server , it should be "localhost" or "127.0.0.1")

8. Visit http://127.0.0.1:8000/home/ to participate in the ftp.
