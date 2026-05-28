import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import styles from './App.module.css';
import { Header } from './components/Header.tsx';
import { EquipmentSheetPage } from './features/equipment-sheet/EquipmentSheetPage.tsx';

export const App = () => (
  <BrowserRouter>
    <div className={styles.appShell}>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/equipo" replace />} />
        <Route path="/equipo" element={<EquipmentSheetPage />} />
        <Route path="*" element={<Navigate to="/equipo" replace />} />
      </Routes>
    </div>
  </BrowserRouter>
);
