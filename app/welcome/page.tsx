'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const goToForm = () => {
    router.push('/formulario');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Bem-vindo(a)!
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-xl text-gray-600 mb-4">
              Olá, <span className="font-semibold text-indigo-600">{user?.email}</span>!
            </p>
            <p className="text-gray-600 mb-8">
              É ótimo ter você aqui. Estamos prontos para começar sua jornada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transform transition hover:scale-105 shadow-lg"
              >
                Ir para o Formulário
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg transform transition hover:scale-105 shadow-lg"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Formulários</h3>
              <p className="text-gray-600">Preencha formulários de forma rápida e segura</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">💾</div>
              <h3 className="text-lg font-semibold mb-2">Dados Seguros</h3>
              <p className="text-gray-600">Seus dados são protegidos e criptografados</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Rápido</h3>
              <p className="text-gray-600">Interface intuitiva e responsiva</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}