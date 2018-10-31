from django.contrib import admin
from upload_form.models import upload
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from tokens import account_activation_token 
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.admin import UserAdmin
from django.utils.http import urlsafe_base64_encode
#from django.contrib.auth.admin import UserProfile

class UserCreationFormExtended(UserCreationForm): 
    def __init__(self, *args, **kwargs): 
        super(UserCreationFormExtended, self).__init__(*args, **kwargs) 
        self.fields['email'] = forms.EmailField(label=_("E-mail"), max_length=75)

UserAdmin.add_form = UserCreationFormExtended
UserAdmin.add_fieldsets = (
    (None, {
        'classes': ('wide',),
        'fields': ('email', 'username', 'password1', 'password2',)
    }),
)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(upload)

class UserAdmin(admin.ModelAdmin):
      actions = ['send_email']
      list_display = ('username','email','first_name','is_active','date_joined','is_staff') 
      def send_email(modeladmin, request, queryset):
          for user in queryset.all():
              subject = 'Set your password'
              current_site = get_current_site(request)
              message = render_to_string("setpassword.html",{
              'user':user,
              'domain':current_site.domain,
              'uid':urlsafe_base64_encode(force_bytes(user.id)),
              'token':PasswordResetTokenGenerator().make_token(user),
              })
              user.email_user(subject,message)
      send_email.short_description = "send email"
      
      

admin.site.unregister(User)
admin.site.register(User,UserAdmin)


