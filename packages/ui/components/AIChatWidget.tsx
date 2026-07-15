import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Input,
  Text,
  Flex,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { ChatIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const WS_URL = 'wss://ia.nami.com.uy';

export const AIChatWidget = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef(`web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/api/ws/chat/${sessionIdRef.current}`);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'welcome') {
          setMessages([{ role: 'assistant', content: data.message }]);
        } else if (data.type === 'message') {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
          setLoading(false);
        } else if (data.type === 'error') {
          setMessages((prev) => [...prev, { role: 'system', content: data.message }]);
          setLoading(false);
        } else if (data.type === 'reset_complete') {
          setMessages([{ role: 'assistant', content: data.message }]);
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectRef.current = setTimeout(() => connectWebSocket(), 3000);
    };

    ws.onerror = () => {
      setConnected(false);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    }
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [isOpen, connectWebSocket]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    setMessages((prev) => [...prev, { role: 'user', content: input.trim() }]);
    setLoading(true);

    wsRef.current.send(JSON.stringify({ type: 'message', content: input.trim() }));
    setInput('');
  };

  const handleReset = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reset' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={onToggle}
        pos="fixed"
        left="1rem"
        bottom="1rem"
        width="2rem"
        height="2rem"
        p="1.75rem"
        borderRadius="50%"
        zIndex="999"
        backgroundColor="#667eea"
        _hover={{ backgroundColor: '#5a6fd6' }}
        _active={{ color: 'white' }}
      >
        {isOpen ? (
          <CloseIcon w="1rem" h="1rem" color="white" />
        ) : (
          <ChatIcon w="1.5rem" h="1.5rem" color="white" />
        )}
      </Button>

      {/* Chat panel */}
      {isOpen && (
        <Box
          pos="fixed"
          left="1rem"
          bottom="5rem"
          w={{ base: 'calc(100vw - 2rem)', sm: '370px' }}
          h={{ base: '60vh', sm: '480px' }}
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          zIndex="1000"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          {/* Header */}
          <Flex
            bgGradient="linear(to-r, #667eea, #764ba2)"
            color="white"
            p="3"
            align="center"
            justify="space-between"
          >
            <Flex align="center" gap="2">
              <ChatIcon />
              <Text fontWeight="bold" fontSize="md">Nami IA</Text>
              <Badge
                colorScheme={connected ? 'green' : 'red'}
                variant="solid"
                fontSize="0.65rem"
                borderRadius="full"
              >
                {connected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </Flex>
            <Flex gap="1">
              <IconButton
                aria-label="Reiniciar"
                icon={<DeleteIcon />}
                size="xs"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                onClick={handleReset}
              />
              <IconButton
                aria-label="Cerrar"
                icon={<CloseIcon />}
                size="xs"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                onClick={onClose}
              />
            </Flex>
          </Flex>

          {/* Messages */}
          <Box flex="1" overflowY="auto" p="3" bg="gray.50">
            {messages.map((msg, idx) => (
              <Flex
                key={idx}
                justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                mb="2"
              >
                <Box
                  maxW="80%"
                  px="3"
                  py="2"
                  borderRadius="lg"
                  bg={
                    msg.role === 'user'
                      ? '#667eea'
                      : msg.role === 'system'
                      ? 'orange.400'
                      : 'white'
                  }
                  color={msg.role === 'user' || msg.role === 'system' ? 'white' : 'gray.800'}
                  boxShadow="sm"
                  border={msg.role === 'assistant' ? '1px solid' : 'none'}
                  borderColor="gray.200"
                >
                  <Text fontSize="xs" fontWeight="bold" mb="0.5">
                    {msg.role === 'user' ? 'Tú' : msg.role === 'system' ? 'Sistema' : 'Nami IA'}
                  </Text>
                  <Text fontSize="sm" whiteSpace="pre-wrap" wordBreak="break-word">
                    {msg.content}
                  </Text>
                </Box>
              </Flex>
            ))}
            {loading && (
              <Flex align="center" gap="2" ml="1">
                <Text fontSize="xs" color="gray.500">Nami IA está escribiendo...</Text>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box p="2" borderTop="1px solid" borderColor="gray.200" bg="white">
            <Flex gap="2">
              <Input
                size="sm"
                placeholder={connected ? 'Escribe tu consulta...' : 'Conectando...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!connected || loading}
                borderRadius="lg"
              />
              <IconButton
                aria-label="Enviar"
                icon={<ChatIcon />}
                size="sm"
                colorScheme="purple"
                onClick={sendMessage}
                isDisabled={!input.trim() || !connected || loading}
                borderRadius="lg"
              />
            </Flex>
            <Text fontSize="2xs" color="gray.400" mt="1">
              Consultá por productos, precios, stock y más.
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};
