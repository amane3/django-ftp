from __future__ import unicode_literals
from django.db import models
import os 
import datetime
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.core.mail import EmailMessage
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator


# Create your models here.
def user_directiory_path(instance,filename):
     return 'user_{0}/{1}'.format(instance.user.username, filename)

class upload(models.Model):
      filename = models.CharField(max_length=50)
      uploadfile = models.FileField(upload_to=user_directiory_path)
      timestamp = models.DateTimeField(auto_now=True)
      description = models.CharField(max_length=200)
      user = models.CharField(max_length=50)
      size = models.CharField(max_length=50)

      def __str__(self):
          return self.filename

      def get_filename(self):
          return os.path.basename(self.uploadfile.name)
 


@receiver(models.signals.post_delete,sender=upload)
def auto_delete_file_on_delete(sender,instance,**kwargs):
    if instance.uploadfile:
       if os.path.isfile(instance.uploadfile.path): 
          os.remove(instance.uploadfile.path)




@receiver(post_save, sender=User)
def send_email(sender, instance, **kwargs):
          if (kwargs["created"] == False):
                 return 0
          elif not instance.is_superuser:
              subject = 'Set your password'
              current_site = Site.objects.get_current().domain
              message = render_to_string("setpassword.html",{
              'domain':current_site,
              'user':instance.username,
              'uid':urlsafe_base64_encode(force_bytes(instance.id)),
              'token':PasswordResetTokenGenerator().make_token(instance),
              })
              instance.email_user(subject,message)
#@receiver(post_save,sender=UserProfile)
#def send_user_data_when_created_by_admin(sender, instance, **kwargs):
#	first_name = instance.user.first_name
#        print('first name is',first_name)
#        last_name = instance.user.last_name
#        email = instance.user.email
#        html_content = "your first name:%s <br> last name:%s "
#        message=EmailMessage(subject='welcome',body=html_content %(first_name,last_name),to=[email])
#        message.content_subtype='html'
#	message.send()
#class UserProfile(models.Model):
	#address = models.CharField(max_length=300,blank=True,null=True,help_text=("enter the address"))
	#contact = models.CharField(max_length=100,blank=True,null=True,help_text=("enter the contact"))
	#user = models.ForeignKey(User)
       


#def __str__(self):
#	return (self.username)

