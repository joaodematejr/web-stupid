'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

interface Device {
  id?: string;
  nome: string;
  tipo: string;
  marca: string;
  modelo: string;
  sistemaOperacional: string;
  versao: string;
  imei?: string;
  numeroSerie?: string;
  observacoes?: string;
  userId: string;
  dataRegistro: Date;
}

export default function CadastroDevice() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'smartphone',
    marca: '',
    modelo: '',
    sistemaOperacional: 'Android',
    versao: '',
    imei: '',
    numeroSerie: '',
    observacoes: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserDevices(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserDevices = async (userId: string) => {
    try {
      const q = query(collection(db, 'devices'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const userDevices: Device[] = [];
      
      querySnapshot.forEach((doc) => {
        userDevices.push({ id: doc.id, ...doc.data() } as Device);
      });
      
      setDevices(userDevices);
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const deviceData = {
        ...formData,
        userId: user?.uid,
        dataRegistro: new Date(),
      };

      await addDoc(collection(db, 'devices'), deviceData);

      setSuccess(true);
      
      // Reset form
      setFormData({
        nome: '',
        tipo: 'smartphone',
        marca: '',
        modelo: '',
        sistemaOperacional: 'Android',
        versao: '',
        imei: '',
        numeroSerie: '',
        observacoes: ''
      });

      // Reload devices list
      if (user) {
        loadUserDevices(user.uid);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao cadastrar dispositivo:', error);
      alert('Erro ao cadastrar dispositivo. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    router.push('/welcome');
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Cadastro de Dispositivos</h1>
            <p className="text-indigo-100">Registre seus dispositivos eletrônicos</p>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-6 mt-4">
              <span className="block sm:inline">✅ Dispositivo cadastrado com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Dispositivo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: iPhone do João"
                />
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="smartphone">Smartphone</option>
                  <option value="tablet">Tablet</option>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="smartwatch">Smartwatch</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  id="marca"
                  name="marca"
                  required
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Apple, Samsung, etc."
                />
              </div>

              <div>
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  required
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: iPhone 14, Galaxy S23, etc."
                />
              </div>

              <div>
                <label htmlFor="sistemaOperacional" className="block text-sm font-medium text-gray-700 mb-2">
                  Sistema Operacional *
                </label>
                <select
                  id="sistemaOperacional"
                  name="sistemaOperacional"
                  required
                  value={formData.sistemaOperacional}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="versao" className="block text-sm font-medium text-gray-700 mb-2">
                  Versão do SO
                </label>
                <input
                  type="text"
                  id="versao"
                  name="versao"
                  value={formData.versao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 14.2, Android 13, etc."
                />
              </div>

              <div>
                <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-2">
                  IMEI (para dispositivos móveis)
                </label>
                <input
                  type="text"
                  id="imei"
                  name="imei"
                  value={formData.imei}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 123456789012345"
                />
              </div>

              <div>
                <label htmlFor="numeroSerie" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Série
                </label>
                <input
                  type="text"
                  id="numeroSerie"
                  name="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Número de série do dispositivo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                value={formData.observacoes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Informações adicionais sobre o dispositivo..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 disabled:opacity-50"
              >
                {submitting ? 'Cadastrando...' : 'Cadastrar Dispositivo'}
              </button>
              
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition duration-200"
              >
                Voltar
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Dispositivos Cadastrados */}
        {devices.length > 0 && (
          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Meus Dispositivos</h2>
              <p className="text-gray-100">Dispositivos já cadastrados</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <div className="text-2xl mr-3">
                        {device.tipo === 'smartphone' && '📱'}
                        {device.tipo === 'tablet' && '📟'}
                        {device.tipo === 'laptop' && '💻'}
                        {device.tipo === 'desktop' && '🖥️'}
                        {device.tipo === 'smartwatch' && '⌚'}
                        {device.tipo === 'outros' && '📱'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{device.nome}</h3>
                        <p className="text-sm text-gray-600">{device.marca} {device.modelo}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Tipo:</span> {device.tipo}</p>
                      <p><span className="font-medium">SO:</span> {device.sistemaOperacional} {device.versao}</p>
                      {device.imei && <p><span className="font-medium">IMEI:</span> {device.imei}</p>}
                      {device.numeroSerie && <p><span className="font-medium">Serial:</span> {device.numeroSerie}</p>}
                    </div>
                    
                    {device.observacoes && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p><span className="font-medium">Obs:</span> {device.observacoes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}