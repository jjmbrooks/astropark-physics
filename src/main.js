import './styles/xenon.css';
import { mountShell } from './views/shell.js';

const app = document.getElementById('app');
if (app) {
  mountShell(app);
} else {
  console.error('AstroPark: #app no encontrado');
}
