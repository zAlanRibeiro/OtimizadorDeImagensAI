import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export default function HomePage() {
  const { user, session } = useAuth(); // Obtém a sessão diretamente do contexto
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [enhancementType, setEnhancementType] = useState('auto');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageResult, setImageResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [error, setError] = useState(null);

  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagePreviewContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const imageResultRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsEnhanced(false);
      setImageResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const onFileChange = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => {
     e.preventDefault();
     e.stopPropagation();
     if (dropAreaRef.current) dropAreaRef.current.classList.remove('drag-over');
     document.body.classList.remove('is-dragging');
     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       handleFile(e.dataTransfer.files[0]);
     }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!session) {
      setError("Sessão inválida. Por favor, faça login novamente.");
      return;
    }

    setIsLoading(true);
    setIsEnhanced(false);
    setError(null);

    try {
      const base64Image = await toBase64(selectedFile);

      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ image: base64Image, enhancementType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao melhorar a imagem.');
      }

      setImageResult(data.enhancedImage);
      setIsEnhanced(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efeitos de drag-and-drop
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefaults = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = () => dropArea.classList.add('drag-over');
    const handleDragLeave = () => dropArea.classList.remove('drag-over');
    const handleBodyDragEnter = () => document.body.classList.add('is-dragging');
    const handleBodyDragLeave = () => document.body.classList.remove('is-dragging');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
        document.body.addEventListener(ev, preventDefaults);
        dropArea.addEventListener(ev, preventDefaults);
    });
    ['dragenter', 'dragover'].forEach(ev => {
        dropArea.addEventListener(ev, handleDragEnter);
        document.body.addEventListener(ev, handleBodyDragEnter);
    });
    ['dragleave', 'drop', 'dragend'].forEach(ev => {
        dropArea.addEventListener(ev, handleDragLeave);
        document.body.addEventListener(ev, handleBodyDragLeave);
    });
    
    dropArea.addEventListener('drop', onDrop);

    return () => { // Limpeza
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
            document.body.removeEventListener(ev, preventDefaults);
            if (dropArea) dropArea.removeEventListener(ev, preventDefaults);
        });
        if (dropArea) dropArea.removeEventListener('drop', onDrop);
    };
  }, []);

  // Lógica do slider
  useEffect(() => {
    const container = imagePreviewContainerRef.current;
    const slider = sliderRef.current;
    const resultImage = imageResultRef.current;
    if (!container || !slider || !resultImage || !isEnhanced) return;

    let isDragging = false;
    
    const updateSlider = (x) => {
        if(slider && resultImage) {
            slider.style.left = `${x}px`;
            resultImage.style.clipPath = `inset(0 0 0 ${x}px)`;
        }
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      updateSlider(x);
    };

    const startDrag = () => { isDragging = true; };
    const stopDrag = () => { isDragging = false; };

    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);

    updateSlider(container.offsetWidth / 2);

    return () => { // Limpeza
        if(slider){
            slider.removeEventListener('mousedown', startDrag);
            slider.removeEventListener('touchstart', startDrag);
        }
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('touchend', stopDrag);
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('touchmove', onDrag);
    };
  }, [isEnhanced]);
  
  return (
    <>
      <Head>
        <title>Otimizador de Imagens para Vendas</title>
        <meta name="description" content="Transforme fotos de produtos e veículos em imagens de alta conversão." />
      </Head>
      
      <div className="flex flex-col items-center p-4 pt-16">
        <Breadcrumbs />
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Otimizador de Imagens para Vendas</h1>
            <p className="text-lg text-gray-400 mt-2">Transforme fotos de produtos e veículos em imagens de alta conversão.</p>
        </div>

        <main className="w-full max-w-6xl bg-gray-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
                <h2 className="text-2xl font-semibold text-gray-200">1. Envie a sua Imagem</h2>
                <div ref={dropAreaRef} onClick={() => fileInputRef.current.click()} className="file-input-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-gray-900/50">
                    <input ref={fileInputRef} type="file" onChange={onFileChange} className="hidden" accept="image/*" />
                    <div className="flex flex-col items-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l1.414-1.414A1 1 0 0115.414 5H17a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <p className="font-semibold">Arraste e solte a sua imagem aqui</p>
                        <p className="text-sm">ou <span className="text-blue-400 font-medium">procure nos seus ficheiros</span></p>
                        <p className="text-xs mt-2 text-gray-500">PNG, JPG, WEBP. Máx 10MB.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-200 pt-4">2. Escolha a Melhoria</h2>
                <div className="space-y-4">
                    <label className="custom-radio flex items-center p-4 bg-slate-900/50 rounded-lg cursor-pointer">
                        <input type="radio" name="enhancement" value="auto" checked={enhancementType === 'auto'} onChange={(e) => setEnhancementType(e.target.value)} className="hidden" />
                        <span className="w-5 h-5 border-2 border-slate-600 rounded-full flex items-center justify-center mr-4"><span className="radio-dot w-3 h-3 bg-blue-500 rounded-full transition-transform transform scale-0"></span></span>
                        <div>
                            <p className="font-semibold text-slate-200">Otimização Automática (com DALL-E 3)</p>
                            <p className="text-sm text-slate-400">Gera uma nova imagem com base na sua.</p>
                        </div>
                    </label>
                    <label className="custom-radio flex items-center p-4 bg-slate-900/50 rounded-lg cursor-not-allowed opacity-50">
                        <input type="radio" name="enhancement" value="upscale" disabled className="hidden" />
                        <span className="w-5 h-5 border-2 border-slate-600 rounded-full flex items-center justify-center mr-4"></span>
                        <div>
                            <p className="font-semibold text-slate-200">Super Resolução 4x</p>
                            <p className="text-sm text-slate-400">(Requer API de edição de imagem)</p>
                        </div>
                    </label>
                    <label className="custom-radio flex items-center p-4 bg-slate-900/50 rounded-lg cursor-not-allowed opacity-50">
                        <input type="radio" name="enhancement" value="background-removal" disabled className="hidden" />
                         <span className="w-5 h-5 border-2 border-slate-600 rounded-full flex items-center justify-center mr-4"></span>
                        <div>
                         <p className="font-semibold text-slate-200">Remoção de Fundo com IA</p>
                         <p className="text-sm text-slate-400">(Requer API de edição de imagem)</p>
                        </div>
                    </label>
                </div>

                <div className="pt-4">
                     <button onClick={handleEnhance} className="w-full text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!selectedFile || isLoading}>
                        {isLoading ? 'A gerar com IA...' : 'Otimizar Imagem'}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                </div>
            </div>

            <div ref={imagePreviewContainerRef} className="bg-gray-900/50 rounded-lg flex items-center justify-center min-h-[400px] lg:min-h-full relative overflow-hidden">
                {!imagePreview && ( <div className="text-center text-gray-500"><svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p className="mt-2">A pré-visualização da sua imagem aparecerá aqui</p></div> )}
                {imagePreview && ( <div className="absolute inset-0"><img src={imagePreview} className="absolute inset-0 w-full h-full object-contain" alt="Pré-visualização da imagem original" />{imageResult && <img ref={imageResultRef} src={imageResult} className="absolute inset-0 w-full h-full object-contain" alt="Resultado da imagem melhorada" />}</div> )}
                {isLoading && ( <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"><div className="loader"></div><p className="mt-4 text-lg font-medium">A gerar com DALL-E 3...</p><p className="text-sm text-gray-400">Isto pode demorar até um minuto.</p></div> )}
                {isEnhanced && ( <> <div ref={sliderRef} className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-white/50 cursor-ew-resize group"><div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"><svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg></div></div><div className="absolute bottom-4 right-4"><a href={imageResult} download="imagem-otimizada.png" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-transform transform hover:scale-105"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg><span>Transferir</span></a></div></> )}
            </div>
        </main>
        
        <section className="w-full max-w-6xl mx-auto mt-16 mb-8 p-6 md:p-8 text-gray-300">
            <h2 className="text-3xl font-bold text-center mb-10">Por que imagens de alta qualidade vendem mais?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="advantages-card p-6 rounded-xl text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 0118 0c.001-.242.002-.484.004-.722A12.02 12.02 0 0021.618 11.984a11.955 11.955 0 01-2-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Aumenta a Confiança</h3>
                    <p className="text-gray-400">Fotos nítidas e profissionais mostram que você se importa com a qualidade, construindo confiança com o cliente.</p>
                </div>
                <div className="advantages-card p-6 rounded-xl text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Percepção de Valor</h3>
                    <p className="text-gray-400">Produtos bem apresentados parecem mais valiosos, justificando um preço premium e atraindo melhores clientes.</p>
                </div>
                <div className="advantages-card p-6 rounded-xl text-center">
                     <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mostra os Detalhes</h3>
                    <p className="text-gray-400">Com super resolução, seu cliente pode dar zoom e ver cada detalhe, eliminando dúvidas e diminuindo as devoluções.</p>
                </div>
                <div className="advantages-card p-6 rounded-xl text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Maior Conversão</h3>
                    <p className="text-gray-400">Imagens otimizadas se destacam, resultando em mais cliques, mais interesse e, finally, mais vendas.</p>
                </div>
            </div>
        </section>
        
        <section id="cta-section" className="w-full max-w-6xl mx-auto mt-16 mb-8 p-8 md:p-12 text-gray-300 bg-slate-900/50 border border-slate-700 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">O Impacto Real no Seu Faturamento</h2>
            <div className="max-w-3xl mx-auto text-lg text-slate-300 space-y-4 mb-8">
                <p>Fotos profissionais não são só estética: <strong>elas aumentam seu faturamento.</strong></p>
                <p>No iFood e Uber Eats, restaurantes com imagens de alta qualidade vendem <strong>até 25% mais.</strong></p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-3xl mx-auto mb-8">
                <p className="text-slate-200 text-xl leading-relaxed">Isso significa transformar <strong className="text-2xl text-white">R$100</strong> em <strong className="text-2xl text-green-400">R$125</strong> por dia — um lucro extra de <strong className="text-2xl text-green-400">R$750 por mês</strong> só melhorando suas fotos.</p>
            </div>
            <Link href="/pricing" id="cta-btn" className="inline-block text-white font-bold py-3 px-8 rounded-lg text-lg">
                Ver Planos e Preços
            </Link>
        </section>
      </div>
    </>
  );
}

