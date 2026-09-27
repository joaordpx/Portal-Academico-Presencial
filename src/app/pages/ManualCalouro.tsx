import React, { useState } from 'react';

import { Header } from '../components/manualCalouro/Header/Header';
import { HeroSection } from '../components/manualCalouro/HeroSections/HeroSection';
import styles from '../components/manualCalouro/ManualCalouro.module.css';
import CarrosselCartazes from '../components/manualCalouro/CarrosselCartazes/CarrosselCartazes';
import { ChecklistCalouro } from '../components/manualCalouro/CheckList.tsx/ChecklistCalouro';
import { PilaresUnimontes } from "../components/manualCalouro/PilaresUnimontes/PilaresUnimontes.tsx";
import { ConexaoCampus } from '../components/manualCalouro/ConexaoCampus/ConexaoCampus.tsx';
import { Footer } from '../components/layout/Footer.tsx';
import WifiModal from '../components/manualCalouro/ConexaoCampus/WifiModal.tsx';
import EmailModal from '../components/manualCalouro/ConexaoCampus/EmailModal.tsx';
import TypebotSofia from '../components/assistant/TypebotSofia';



export const ManualCalouro: React.FC = () => {
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleNavigation = (route: string) => {
    console.log(`Navegar para a rota: ${route}`);
  };

  return (
    <div className={styles.pageWrapper}>

      <Header onNavigate={handleNavigation} />

      <main className={styles.container}>

        <HeroSection />

        <ConexaoCampus
          onSelectWifi={() => setIsWifiModalOpen(true)}
          onSelectEmail={() => setIsEmailModalOpen(true)}
        />

        <PilaresUnimontes />

        <ChecklistCalouro />

        <CarrosselCartazes />

        <TypebotSofia />

        <Footer />

      </main>

      <WifiModal
        isOpen={isWifiModalOpen}
        onClose={() => setIsWifiModalOpen(false)}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />



    </div>
  );
};


export default ManualCalouro;