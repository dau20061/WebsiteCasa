import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import SampleRequestModal from '../components/SampleRequestModal';
import LightboxModal from '../components/LightboxModal';
import FloatingContact from '../components/FloatingContact';
import { ToastProvider } from '../components/Toast';

// Context to open sample request or lightbox from any page
export const AppUIContext = createContext({
  openSampleModal: () => {},
  openLightbox: () => {},
});

export const useAppUI = () => useContext(AppUIContext);

export default function MainLayout() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleProduct, setSampleProduct] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState(null);

  const openSampleModal = (product = null) => {
    setSampleProduct(product);
    setSampleModalOpen(true);
  };

  const closeSampleModal = () => {
    setSampleModalOpen(false);
    setSampleProduct(null);
  };

  const openLightbox = (data) => {
    setLightboxData(data);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxData(null);
  };

  return (
    <AppUIContext.Provider value={{ openSampleModal, openLightbox }}>
      <div className="flex flex-col min-h-screen bg-[#FAF9F5] dark:bg-[#0B130E] text-gray-800 dark:text-gray-100 transition-colors duration-200">
        <Navbar onOpenSampleModal={() => openSampleModal()} />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />

        <ScrollToTop />
        <FloatingContact />

        <SampleRequestModal
          isOpen={sampleModalOpen}
          onClose={closeSampleModal}
          defaultProduct={sampleProduct}
        />

        <LightboxModal
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          data={lightboxData}
        />
      </div>
    </AppUIContext.Provider>
  );
}

