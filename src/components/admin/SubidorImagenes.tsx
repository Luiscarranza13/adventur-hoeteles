'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface SubidorImagenesProps {
  bucket: string;
  carpeta: string;
  imagenesActuales: string[];
  onChange: (urls: string[]) => void;
  maxImagenes?: number;
}

interface ImagenEstado {
  url: string;
  subiendo: boolean;
  error?: string;
}

export function SubidorImagenes({
  bucket,
  carpeta,
  imagenesActuales,
  onChange,
  maxImagenes = 5,
}: SubidorImagenesProps) {
  const [imagenes, setImagenes] = useState<ImagenEstado[]>(
    imagenesActuales.map(url => ({ url, subiendo: false }))
  );
  const [arrastrando, setArrastrando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notificar al padre solo cuando cambian las URLs válidas — fuera del render
  useEffect(() => {
    const validas = imagenes.filter(i => i.url && !i.error && !i.subiendo).map(i => i.url);
    onChange(validas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagenes]);

  const subirArchivo = async (archivo: File): Promise<string | null> => {
    const supabase = createClient();
    const extension = archivo.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(nombreArchivo, archivo, { cacheControl: '3600', upsert: false });

    if (error) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo);
    return data.publicUrl;
  };

  const procesarArchivos = async (archivos: FileList | File[]) => {
    const lista = Array.from(archivos);
    const disponibles = maxImagenes - imagenes.filter(i => !i.error).length;
    const aSubir = lista.slice(0, disponibles);
    if (aSubir.length === 0) return;

    // Agregar placeholders de carga
    const placeholders: ImagenEstado[] = aSubir.map(() => ({ url: '', subiendo: true }));
    setImagenes(prev => [...prev, ...placeholders]);

    // Subir en paralelo
    const resultados = await Promise.all(
      aSubir.map(archivo => subirArchivo(archivo))
    );

    // Actualizar con resultados reales
    setImagenes(prev => {
      const copia = [...prev];
      const base = copia.length - aSubir.length;
      resultados.forEach((url, idx) => {
        copia[base + idx] = url
          ? { url, subiendo: false }
          : { url: '', subiendo: false, error: 'Error al subir' };
      });
      return copia;
    });
  };

  const eliminar = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    procesarArchivos(e.dataTransfer.files);
  };

  const puedeSubirMas = imagenes.filter(i => !i.error).length < maxImagenes;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Imágenes{' '}
        <span className="text-gray-400 font-normal normal-case">
          ({imagenes.filter(i => i.url && !i.error).length}/{maxImagenes})
        </span>
      </label>

      {/* Grid de previews */}
      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imagenes.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group">
              {img.subiendo ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 size={20} className="text-[#001f3f] animate-spin" />
                </div>
              ) : img.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 gap-1">
                  <AlertCircle size={16} className="text-red-400" />
                  <span className="text-xs text-red-400">Error</span>
                  <button
                    type="button"
                    onClick={() => eliminar(i)}
                    className="text-xs text-red-400 underline mt-0.5"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <>
                  <Image
                    src={img.url}
                    alt={`Imagen ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-[#ffd600] text-[#001f3f] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <button
                    type="button"
                    onClick={() => eliminar(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={14} className="text-green-400" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Zona de drop */}
      {puedeSubirMas && (
        <div
          onDragOver={e => { e.preventDefault(); setArrastrando(true); }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            arrastrando
              ? 'border-[#ffd600] bg-[#ffd600]/5 scale-[1.01]'
              : 'border-gray-200 hover:border-[#ffd600]/50 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={e => e.target.files && procesarArchivos(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${arrastrando ? 'bg-[#ffd600]' : 'bg-gray-100'}`}>
              {arrastrando
                ? <Upload size={18} className="text-[#001f3f]" />
                : <ImageIcon size={18} className="text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {arrastrando ? 'Suelta las imágenes aquí' : 'Arrastra imágenes o haz clic'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · Máx. {maxImagenes} imágenes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
