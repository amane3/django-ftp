from django import forms 
from .models import upload
from django.contrib.auth.models import User
from django.contrib.auth.forms import (
    AuthenticationForm
)
from django.contrib.auth.forms import UserCreationForm,SetPasswordForm

class uploadform(forms.ModelForm):
      class Meta:
            model  = upload
            fields = '__all__'
            widgets = {
                  'filename':forms.TextInput(attrs={
                        'aria-describedby':'alert',
                        'style':'display:none;',
                  }),
                  'uploadfile':forms.FileInput(attrs={
                        'class':'form-control',   
                        'required':'required', 
                  }),
                  'description':forms.TextInput(attrs={
                        'class':'form-control',
                        'required':'required',
                        'placeholder':'Description',
                  }),
                  'user':forms.TextInput(attrs={
                        'style':'display:none;',
                  }),
                  'size':forms.TextInput(attrs={
                        'required':'required',
                        'style':'display:none',
                  }),
            }



class LoginForm(AuthenticationForm):
      def  __init__(self,*args,**kwargs):
           super(LoginForm, self).__init__(*args,**kwargs)
           for field in self.fields.values():
               field.widget.attrs['class'] = 'form-control'
               field.widget.attrs['placeholder'] = field.label


class SetForm(SetPasswordForm):
      def  __init__(self,*args,**kwargs):
           super(SetForm, self).__init__(*args,**kwargs)
           for field in self.fields.values():
               field.widget.attrs['class'] = 'form-control'
               field.widget.attrs['placeholder'] = field.label


class SignUpForm(UserCreationForm):
      email = forms.EmailField(max_length=254, help_text="Required. Inform a valid email address.",widget=forms.EmailInput(attrs={'class':'form-control',"placeholder":"Email"}))
      password1 = forms.CharField(label=("Password"),
                   widget=forms.PasswordInput(attrs={"class":"form-control","placeholder":"Password"}))
      password2 = forms.CharField(label=("Password confirmation"),
                   widget=forms.PasswordInput(attrs={"class":"form-control","placeholder":"Password confirmation"}))
      class Meta:
          model = User
          fields = ('username','email','password1','password2')
          widgets = {
                   'username':forms.TextInput(attrs={
                        'class':'form-control', 
                        'required':'required',
                        'placeholder':'Username',
                        }),         
           }



class uploadmodelform(forms.ModelForm):

    class Meta:
        model = upload
        exclude = []
      
