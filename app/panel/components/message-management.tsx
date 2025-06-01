"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, MailOpen, Trash2, Search, Loader2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
}

interface MessageResponse {
  success: boolean;
  data: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const { toast } = useToast();

  const fetchMessages = async (status?: string, page = 1) => {
    try {
      setLoading(true);
      const url = new URL('/api/messages', window.location.origin);
      if (status && status !== 'all') url.searchParams.set('status', status.toUpperCase());
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '10');

      const response = await fetch(url.toString());
      const data: MessageResponse = await response.json();

      if (data.success) {
        setMessages(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error('Error al cargar mensajes');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los mensajes'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: number, status: 'UNREAD' | 'READ') => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, status } : msg
          )
        );
        toast({
          title: 'Éxito',
          description: `Mensaje marcado como ${status === 'READ' ? 'leído' : 'no leído'}`
        });
      } else {
        throw new Error('Error al actualizar mensaje');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el mensaje'
      });
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        toast({
          title: 'Éxito',
          description: 'Mensaje eliminado correctamente'
        });
      } else {
        throw new Error('Error al eliminar mensaje');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el mensaje'
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMessages(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const getStatusBadge = (status: string) => {
    return status === 'UNREAD' ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Mail className="h-3 w-3" />
        No leído
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <MailOpen className="h-3 w-3" />
        Leído
      </Badge>
    );
  };

  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;
  const readCount = messages.filter(m => m.status === 'READ').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Mensajes</h2>
          <p className="text-gray-600">Administra los mensajes de contacto recibidos</p>
        </div>
        <Button 
          onClick={() => fetchMessages(activeTab, currentPage)}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar mensajes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Todos ({pagination.total})
          </TabsTrigger>
          <TabsTrigger value="unread">
            No leídos ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            Leídos ({readCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {messages.length === 0 ? 'No hay mensajes' : 'No se encontraron mensajes'}
                </h3>
                <p className="text-gray-600">
                  {messages.length === 0 
                    ? 'Aún no has recibido ningún mensaje de contacto.'
                    : 'Intenta con otros términos de búsqueda.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id} className={`${message.status === 'UNREAD' ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{message.name}</CardTitle>
                        <p className="text-sm text-gray-600 break-all">{message.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(message.status)}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(message.createdAt), { 
                            addSuffix: true,
                            locale: es 
                          })}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMessageStatus(
                            message.id, 
                            message.status === 'UNREAD' ? 'READ' : 'UNREAD'
                          )}
                          className="flex items-center gap-1"
                        >
                          {message.status === 'UNREAD' ? (
                            <>
                              <MailOpen className="h-4 w-4" />
                              Marcar como leído
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />
                              Marcar como no leído
                            </>
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-1">
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar mensaje?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El mensaje de {message.name} será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMessage(message.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 