from rest_framework import generics

from .models import Todo
from .serializers import TodoSerializer


from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

# class ListTodo(generics.ListAPIView):
#     queryset = Todo.objects.all()
#     serializer_class = TodoSerializer


# class DetailTodo(generics.RetrieveAPIView):
#     queryset = Todo.objects.all()
#     serializer_class = TodoSerializer


@api_view(['GET'])
def apiOverview(request):
	api_urls = {
		'List':'/todo-list/',
		'Detail View':'/todo-detail/<str:pk>/',
		'Create':'/todo-create/',
		'Update':'/todo-update/<str:pk>/',
		'Delete':'/todo-delete/<str:pk>/',
		}

	return Response(api_urls)

@api_view(['GET'])
def taskList(request):
	todos = Todo.objects.all().order_by('-id')
	serializer = TodoSerializer(todos, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
	todos = Todo.objects.get(id=pk)
	serializer = TodoSerializer(todos, many=False)
	return Response(serializer.data)


@api_view(['POST'])
def taskCreate(request):
	serializer = TodoSerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)

@api_view(['POST'])
def taskUpdate(request, pk):
	todo = Todo.objects.get(id=pk)
	serializer = TodoSerializer(instance=todo, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['DELETE'])
def taskDelete(request, pk):
	todo = Todo.objects.get(id=pk)
	todo.delete()

	return Response('Item succsesfully delete!')