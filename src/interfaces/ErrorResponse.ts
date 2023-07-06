import MessageResponse from './MessageResponse';

interface ErrorResponse extends MessageResponse {
  stack?: string;
}

export default ErrorResponse;