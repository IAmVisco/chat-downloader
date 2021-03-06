import fetchBuilder from 'fetch-retry';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

const LOAD_LIMIT = 2000;
const fetchRetry = fetchBuilder(window.fetch);
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

interface ChatMessage {
  time: number;
  time_text: string;
  amount: string;
  author: string | null;
  message: string | null;
}

interface FormData {
  url: string;
  scOnly: boolean;
}

interface TaskData {
  taskId?: string;
  videoId?: string;
  host?: string;
}

const getHostLink = (msg: ChatMessage, host: string, videoId: string): string => {
  switch (host) {
    case 'youtu.be':
      return `https://youtu.be/${videoId}?t=${msg.time > 0 ? msg.time.toFixed(0) : 0}`;
    case 'twitch.tv':
      return `https://twitch.tv/videos/${videoId}?t=${msg.time > 0 ? msg.time.toFixed(0) : 0}s`;
    default:
      return '';
  }
};

export const App = () => {
  const formData = JSON.parse(localStorage.getItem('cachedFormData') || '{}');
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { scOnly: true, ...formData } });
  const [filter, setFilter] = useState('');
  const [{ taskId, videoId, host }, setTaskData] = useState<TaskData>({});
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [chatData, setChatData] = useState<ChatMessage[] | null>(null);
  const [filteredChatData, setFilteredChatData] = useState<ChatMessage[]>([]);
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    fetch(backendUrl).catch(() => setError('⚠ Backend unavailable ⚠'));
  }, []);

  useEffect(() => {
    const filterRegex = new RegExp(filter, 'i');
    const filteredData = chatData?.filter((sc) =>
      filter ? (sc.message && sc.message.match(filterRegex)) || (sc.author && sc.author.match(filterRegex)) : sc
    );
    setFilteredChatData(filteredData || []);
  }, [chatData, filter]);

  const submitForm: SubmitHandler<FormData> = async (data) => {
    setError(null);
    setTaskData({});
    setChatData(null);
    setFetching(true);
    setShowExtended(false);
    const body = JSON.stringify(data);
    localStorage.setItem('cachedFormData', body);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message);
      }

      const { id: taskId, videoId, host } = await response.json();
      setTaskData({ taskId, videoId, host });
      fetchRetry(`${backendUrl}/chat/status/${taskId}`, {
        retryOn: async (_, __, res) => (await res?.json())?.state === 'SENT',
        retryDelay: 2000,
      }).then(async () => {
        const response = await fetch(`${backendUrl}/chat/${taskId}`);
        setFetching(false);
        if (response.ok) setChatData(await response.json());
        else {
          const error = await response.json();
          setError(error?.message);
        }
      });
    } catch (e) {
      setError(e.message);
      setFetching(false);
    }
  };

  const downloadCSV = async () => {
    const response = await fetch(`${backendUrl}/chat/${taskId}/csv`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${taskId}.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } else {
      const error = await response.json();
      setError(error?.message);
    }
  };

  return (
    <Container fluid="xl" style={{ overflowX: 'auto' }}>
      <Row>
        <Col>
          <h1>Chat Downloader</h1>
          <hr />
        </Col>
      </Row>
      <Form className="pb-1 px-2" onSubmit={handleSubmit(submitForm)}>
        <Form.Group as={Row} controlId="formSearch">
          <Col>
            <Form.Control
              type="search"
              className="mx-0"
              required
              tabIndex={1}
              placeholder="YouTube Link"
              {...register('url')}
            />
          </Col>
          <Button variant="primary" type="submit" className="col-3" tabIndex={3} disabled={fetching}>
            {fetching ? <Spinner animation="border" size="sm" /> : 'Load'}
          </Button>
          <Form.Group as={Row} className="my-3">
            <Col>
              <Form.Check type="checkbox" label="Super Chats only" tabIndex={2} {...register('scOnly')} />
            </Col>
          </Form.Group>
        </Form.Group>
      </Form>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {chatData ? (
        <>
          <Row className="pb-3">
            <Col md={4}>
              <h3>Chat messages</h3>
              {chatData.length ? (
                <small>
                  {filter ? 'Showing' : 'Loaded'} {filteredChatData.length} messages.
                  {chatData.length > LOAD_LIMIT &&
                    !showExtended &&
                    ` Preview for more than ${LOAD_LIMIT} messages is disabled by default. `}
                  {chatData.length > LOAD_LIMIT && !showExtended && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a href="#" onClick={() => setShowExtended(true)}>
                      Load anyway
                    </a>
                  )}
                </small>
              ) : (
                <small>Loaded {chatData.length} messages. Maybe try different filters?</small>
              )}
            </Col>
            <Col md={4}>
              <Form.Control
                type="search"
                className="mb-4"
                placeholder="Search author or message..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Col>
            <Col md={4} style={{ textAlign: 'right' }}>
              <Button variant="success" onClick={downloadCSV}>
                Download CSV
              </Button>
            </Col>
          </Row>

          {((chatData.length > LOAD_LIMIT && showExtended) || chatData.length < LOAD_LIMIT) && (
            <Table variant="dark" hover>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Author</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredChatData.map((msg) => (
                  <tr>
                    <td>
                      <a href={getHostLink(msg, host!, videoId!)} target="_blank" rel="noreferrer">
                        {msg.time_text}
                      </a>
                    </td>
                    <td>{msg.amount || '-'}</td>
                    <td>{msg.author}</td>
                    <td>{msg.message || ''}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : null}
    </Container>
  );
};
