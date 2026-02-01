import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { Lock, Save, Upload, Image as ImageIcon, Video, Trash2, RefreshCw } from 'lucide-react';
import { JaniboxLogo } from '../../components/shared/Logos';

const Settings = () => {
    const [token, setToken] = useState('');
    const [storeId, setStoreId] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [logoUrl, setLogoUrl] = useState('DEFAULT_SVG');
    const [bannerVideoUrl, setBannerVideoUrl] = useState('/assets/banner.mp4');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .single();

            if (error) {
                // If it fails (e.g., table empty), we might default to empty or env vars if we want fallbacks.
                // But for now, just show empty to prompt user to fill it.
                console.error("Error fetching settings:", error);
            } else if (data) {
                setToken(data.payphone_token || '');
                setStoreId(data.payphone_store_id || '');
                setEnabled(data.payphone_enabled ?? true);
                if (data.logo_url) setLogoUrl(data.logo_url);
                if (data.banner_video_url) setBannerVideoUrl(data.banner_video_url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'banner') => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${field}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('branding')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('branding')
                .getPublicUrl(filePath);

            if (field === 'logo') setLogoUrl(publicUrl);
            else setBannerVideoUrl(publicUrl);

            toast.success(`${field === 'logo' ? 'Logo' : 'Video'} subido correctamente`);
        } catch (error: any) {
            toast.error('Error al subir archivo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Check if exists
            const { data: existing } = await supabase.from('store_settings').select('id').single();

            const settingsData = {
                payphone_token: token,
                payphone_store_id: storeId,
                payphone_enabled: enabled,
                logo_url: logoUrl === 'DEFAULT_SVG' ? '' : logoUrl,
                banner_video_url: bannerVideoUrl
            };

            if (existing) {
                const { error } = await supabase
                    .from('store_settings')
                    .update(settingsData)
                    .eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('store_settings')
                    .insert([settingsData]);
                if (error) throw error;
            }

            toast.success('Configuración guardada exitosamente');
        } catch (error: any) {
            toast.error('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Cargando configuración...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Configuración</h1>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Identidad Digital</h2>
                        <p className="text-sm text-gray-400">Personaliza el logo y video de tu tienda.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo Section */}
                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Logo de la Tienda</label>
                        <div className="relative group aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all hover:border-pink-200">
                            {logoUrl ? (
                                <>
                                    {logoUrl === 'DEFAULT_SVG' ? (
                                        <div className="p-12">
                                            <JaniboxLogo className="w-full h-full text-primary" />
                                        </div>
                                    ) : (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setLogoUrl('DEFAULT_SVG')}
                                            className="p-3 bg-white text-red-500 rounded-2xl hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="flex flex-col items-center gap-3 cursor-pointer">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-pink-500">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Subir Logo (PNG/JPG)</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} disabled={uploading} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Banner Section */}
                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Video del Banner</label>
                        <div className="relative group aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all hover:border-pink-200">
                            {bannerVideoUrl ? (
                                <>
                                    <video src={bannerVideoUrl} className="w-full h-full object-cover" muted loop autoPlay />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setBannerVideoUrl('')}
                                            className="p-3 bg-white text-red-500 rounded-2xl hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="flex flex-col items-center gap-3 cursor-pointer">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-pink-500">
                                        <Video size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Subir Video (MP4)</span>
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'banner')} disabled={uploading} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {uploading && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-pink-500 animate-pulse">
                        <RefreshCw size={12} className="animate-spin" />
                        Subiendo archivo...
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Credenciales de PayPhone</h2>
                        <p className="text-sm text-gray-400">Gestiona las llaves de acceso para los pagos.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                            <span className="block font-bold text-gray-900">Activar Pagos con PayPhone</span>
                            <span className="text-xs text-gray-400">Habilita o deshabilita esta opción en el Checkout</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={e => setEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Token Personal (Production)
                        </label>
                        <input
                            type="password"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder="Copiar desde PayPhone Developers..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono"
                        />
                        <p className="mt-2 text-[10px] text-gray-400">
                            Nunca compartas este token con nadie. Se usa para crear los links de pago.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Store ID (ID de Tienda)
                        </label>
                        <input
                            type="text"
                            value={storeId}
                            onChange={e => setStoreId(e.target.value)}
                            placeholder="Ej. fe14afb9-..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-500 rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
