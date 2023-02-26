"""notifier URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, URLPattern, URLResolver
from rest_framework import routers
from blockmonitor import views

router = routers.DefaultRouter()
router.register(r'phoneVerifications', views.PhoneVerificationView, 'phoneVerification')

urlpatterns = [
    path('', include('blockmonitor.urls')),
    path('admin/', admin.site.urls),
    # path('api/', include(router.urls)),
    # path('', include('approvalgate.urls')),

]

# Per...
# from django.conf import settings
# urlconf = __import__(settings.ROOT_URLCONF, {}, {}, [''])
#
# def list_urls(lis, acc=None):
#     if acc is None:
#         acc = []
#     if not lis:
#         return
#     l = lis[0]
#     if isinstance(l, URLPattern):
#         yield acc + [str(l.pattern)]
#     elif isinstance(l, URLResolver):
#         yield from list_urls(l.url_patterns, acc + [str(l.pattern)])
#     yield from list_urls(lis[1:], acc)
#
# for p in list_urls(urlconf.urlpatterns):
#     print(''.join(p))

# Have...
# admin/
# admin/login/
# admin/logout/
# admin/password_change/
# admin/password_change/done/
# admin/autocomplete/
# admin/jsi18n/
# admin/r/<int:content_type_id>/<path:object_id>/
# admin/auth/group/
# admin/auth/group/add/
# admin/auth/group/<path:object_id>/history/
# admin/auth/group/<path:object_id>/delete/
# admin/auth/group/<path:object_id>/change/
# admin/auth/group/<path:object_id>/
# admin/blockmonitor/phoneverification/
# admin/blockmonitor/phoneverification/add/
# admin/blockmonitor/phoneverification/<path:object_id>/history/
# admin/blockmonitor/phoneverification/<path:object_id>/delete/
# admin/blockmonitor/phoneverification/<path:object_id>/change/
# admin/blockmonitor/phoneverification/<path:object_id>/
# admin/^(?P<app_label>auth|blockmonitor)/$
# admin/(?P<url>.*)$
# api/^phoneVerifications/$
# api/^phoneVerifications\.(?P<format>[a-z0-9]+)/?$
# api/^phoneVerifications/(?P<pk>[^/.]+)/$
# api/^phoneVerifications/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$
# api/^$
# api/^\.(?P<format>[a-z0-9]+)/?$
