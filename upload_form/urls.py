from django.conf.urls import url
from . import views
from django.views.generic import FormView
from .forms import uploadform,uploadmodelform
from forms import LoginForm
from forms import SetForm 


app_name="upload_form"

urlpatterns = [
     url(r'^$', views.index,name='index'),
     url(r'^home$', views.index, name='index'),
     url(r'^uploads/$',views.uploads, name='uploads'),
     url(r'^uploads2/$',views.uploads2, name='uploads2'),
     url(r'^save/$',views.save, name='save'),
     url(r'^save2/$',views.save2,name='save2'),
     url(r'^checkfile/$',views.checkfile,name='checkfile'),
     url(r'^downloadfile/$',views.downloadfile, name='downloadfile'),
     url(r'^deletefile/$',views.deletefile,name='deletefile'),
     url(r'^login/$','django.contrib.auth.views.login',{'authentication_form':LoginForm}),
     url(r'^logout/$','django.contrib.auth.views.logout',name = 'logout'),
     url(r'^account_activation_sent/$',views.account_activation_sent,name='account_activation_sent'),
     url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',views.activate, name="activate"),
     url(r'^set/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$','django.contrib.auth.views.password_reset_confirm',{'set_password_form':SetForm}),
     url(r'^reset/done/$','django.contrib.auth.views.password_reset_complete'),
]
