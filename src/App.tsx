/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { NoticeBanner } from './components/NoticeBanner.tsx';
import { Hero } from './components/Hero.tsx';
import { PopularServices } from './components/PopularServices.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { WhyChooseUs } from './components/WhyChooseUs.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { LegalFooter } from './components/LegalFooter.tsx';
import { ApplicationWizard } from './components/ApplicationWizard.tsx';
import { TrackStatusModal } from './components/TrackStatusModal.tsx';
import { ServiceDetailModal } from './components/ServiceDetailModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';

function MainLayout() {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-gujarati">
      {/* Navigation */}
      <Navbar />

      {/* Announcements */}
      <NoticeBanner />

      {/* Main Body Switching */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />
            <PopularServices showAll={false} />
            <HowItWorks />
            <WhyChooseUs />
            <ContactSection />
          </>
        )}

        {activeView === 'services' && (
          <div className="py-6">
            <PopularServices showAll={true} />
            <HowItWorks />
          </div>
        )}

        {activeView === 'contact' && (
          <div className="py-6">
            <ContactSection />
            <WhyChooseUs />
          </div>
        )}

        {activeView === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Mandatory Legal & Privacy Footer */}
      <LegalFooter />

      {/* Global Interactive Modals */}
      <ApplicationWizard />
      <TrackStatusModal />
      <ServiceDetailModal />
      <PaymentModal />
      <ReceiptModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
