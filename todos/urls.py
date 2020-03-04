from django.urls import path

from . import views

urlpatterns = [
	path('', views.apiOverview, name="api-overview"),
	path('todo-list/', views.taskList, name="todo-list"),
	path('todo-detail/<str:pk>/', views.taskDetail, name="todo-detail"),
	path('todo-create/', views.taskCreate, name="todo-create"),

	path('todo-update/<str:pk>/', views.taskUpdate, name="todo-update"),
	path('todo-delete/<str:pk>/', views.taskDelete, name="todo-delete"),
	]