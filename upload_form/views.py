from django.shortcuts import render
from django.shortcuts import render,redirect
from django.template.context_processors import csrf
from django.conf import settings
from .forms import uploadform
from .models import upload
from django.views.decorators.http import require_POST
import sys,os
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
import json
from django.http.response import JsonResponse 
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth import login,authenticate
from django.contrib.auth.forms import UserCreationForm
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from tokens import account_activation_token 
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.utils.encoding import force_text
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode
from forms import SignUpForm
# Create your views here.

def signup(request):
    if request.method =="POST":
       form = SignUpForm(request.POST)
       if form.is_valid():
          user = form.save(commit=False)
          user.is_active = False
          user.save()
          current_site = get_current_site(request)
          subject = 'Activate Your Account'
          message = render_to_string("account_activation_email.html",{
          'user':user,
          'domain':current_site.domain,
          'uid':urlsafe_base64_encode(force_bytes(user.id)),
          'token':account_activation_token.make_token(user),
          })
          user.email_user(subject,message)
          return redirect('/account_activation_sent')
    else:
       form = SignUpForm()
    return render(request,'signup.html',{'form':form})
 
def account_activation_sent(request):
    return render(request,'register/account_activation.html')


def activate(request, uidb64, token):
    
    
    uid = force_text(urlsafe_base64_decode(uidb64))
    user = User.objects.get(pk=uid)
    username = user.username
    password = user.password
  
    if user is not None and account_activation_token.check_token(user, token):
        
        user.is_active = True
        user.profile.email_confirmed = True
        user.save()
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        
        return redirect('/home')
    else:
        contexts={
            'uidb64':uidb64,
            'token':token,
            'user':username,
            'uid':uid,
            'password':password,
            'UserID':user,
         
}
        return render(request, 'account_activation_invalid.html',contexts)




@login_required
def index(request):
    if request.user.is_superuser:
       contexts ={
               'all_data':upload.objects.all()
               }
    else:
       contexts ={
               'all_data':upload.objects.filter(user = request.user)
               }
    return render(request, 'upload_form/index.html',contexts)

@login_required
def uploads(request):
    form = uploadform()
    return render(request,'upload_form/upload.html',{'form':form})

@login_required
def uploads2(request):
    form = uploadform()
    return render(request,'upload_form/upload2.html',{'form':form})

@login_required
def downloads(request):
         contexts ={
            'all_data':upload.objects.all()
         }
    
         return render(request, 'upload_form/downloads.html',contexts)

@require_POST
def save(request):
    name = request.POST['filename']
    form = uploadform(data=request.POST, files=request.FILES)
    u = upload(
      filename = name,
      uploadfile = request.FILES['uploadfile'],
      description = request.POST['description'],
      size = request.POST['size'],
      user = request.user
    )
    if upload.objects.filter(user = request.user,filename = name).exists():
       alert = '*This file already exists.' 
       contexts = {
          'all_data':upload.objects.all(),
          'form':form,
          'alert':alert,
       }
       return render(request, 'upload_form/upload.html',contexts)
   
    else:
         u.save()
         return HttpResponseRedirect('/home')
@require_POST
def checkfile(request):
    name = request.POST['filename']
    if upload.objects.filter(user = request.user,filename = name).exists():   
      message ={'message':'fail'}  
      return JsonResponse(message)
    else:
      message ={'message':'success'}
      return JsonResponse(message)
 

def send_email(request,action):
         subject = 'Notification'
         message = render_to_string("notification.html",{
         'user':request.user,
         'action':action,
         'files':request.POST['filename'].replace("?","\n")
         })
         recipient_list = list(User.objects.filter(is_superuser=True).exclude(email__isnull=True).values_list('email',flat = True))
         send_mail(subject,message,from_email,recipient_list)
         return

@require_POST
def save2(request):
         name = request.POST['filename']
         u = upload(
         filename = name,
         uploadfile = request.FILES['uploadfile'],
         description = request.POST['description'],
         size = request.POST['size'],
         user = request.user)
         u.save()
         message2 = {'message':'success'} 
         action = "upload"
         if not request.user.is_superuser:
             send_email(request,action)
         return JsonResponse(message2)

@require_POST
def downloadfile(request):
    requestfile = request.POST['filename']
    flag = False
    val = requestfile.split("?")
    val = filter(lambda str:str !='',val)
    if request.user.is_superuser:
      username = request.POST['name']
      val2 = username.split("?")
      val2 = filter(lambda str:str !='',val2)
    filelist = []
    filename = []
    for i, value in enumerate(val):
     if request.user.is_superuser:     
      if upload.objects.filter(filename = value,user=val2[i]).exists():
        path = upload.objects.get(filename = value,user=val2[i])
        downloadfile = path.uploadfile.url
        filelist.append(downloadfile)
        filename.append(value)
      else:
        contexts = {
               'alert':'*The file does not exist.',
               'all_data':upload.objects.all()
}
        return render(request, 'upload_form/index.html',contexts) 
     else:
      if upload.objects.filter(filename = value,user = request.user).exists:
       path = upload.objects.get(filename = value,user=request.user)  
       downloadfile = path.uploadfile.url
       filelist.append(downloadfile)
       filename.append(value)
       flag = True
      else:
        contexts = {
               'alert':'*The file does not exist.',
               'all_data':upload.objects.all()
}
        return render(request, 'upload_form/index.html',contexts)
    contexts = {
         'downloadfile':filelist,
         'filename':filename
       }
    if flag == True:
       action = "download"
       send_email(request,action)
    return render(request,'upload_form/downloading.html',contexts)
    raise Http404
    

@require_POST
def deletefile(request):
    deletefile = request.POST['deletefile']
    val3 = deletefile.split("?")
    val3 = filter(lambda str:str !='',val3)
    if request.user.is_superuser:
      username = request.POST['username']
      val4 = username.split("?")
      val4 = filter(lambda str:str !='',val4)
    for i, value in enumerate(val3):
      if request.user.is_superuser:    
        upload.objects.filter(filename = value,user = val4[i]).delete()
      else:
        upload.objects.filter(filename = value,user = request.user).delete()
    return HttpResponseRedirect('/home')





