import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Autocomplete, Paper } from '@mui/material';

// Örnek veriler
const depolar = [
    { id: 1, ad: 'Merkez Depo' },
    { id: 2, ad: 'Şube Depo' },
    { id: 3, ad: 'Yedek Depo' },
];

const urunler = [
    { id: 101, ad: 'Laptop', stok: { 1: 120, 2: 45, 3: 10 } },
    { id: 102, ad: 'Klavye', stok: { 1: 80, 2: 60, 3: 25 } },
    { id: 103, ad: 'Mouse', stok: { 1: 200, 2: 150, 3: 50 } },
];


export default function TransferPage() {
    const [kaynakDepo, setKaynakDepo] = useState('');
    const [hedefDepo, setHedefDepo] = useState('');
    const [urun, setUrun] = useState(null);
    const [miktar, setMiktar] = useState('');
    const [sonuc, setSonuc] = useState('');
    const [errors, setErrors] = useState({});

    const stokDurumu = urun && kaynakDepo
        ? urun.stok[kaynakDepo] || 0
        : '-';


    const handleTransfer = () => {
        let newErrors = {};
        setSonuc('');

        if (!kaynakDepo) newErrors.kaynakDepo = 'Kaynak depo seçilmeli';
        if (!hedefDepo) newErrors.hedefDepo = 'Hedef depo seçilmeli';
        if (kaynakDepo && hedefDepo && kaynakDepo === hedefDepo) {
            newErrors.hedefDepo = 'Kaynak ve hedef depo farklı olmalı';
            newErrors.kaynakDepo = 'Kaynak ve hedef depo farklı olmalı';
        }
        if (!urun) newErrors.urun = 'Ürün seçilmeli';
        if (!miktar || isNaN(miktar) || Number(miktar) <= 0) newErrors.miktar = 'Miktar 0’dan büyük olmalı';
        if (urun && kaynakDepo && Number(miktar) > (urun.stok[kaynakDepo] || 0)) {
            newErrors.miktar = 'Yetersiz stok!';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSonuc('Transfer başarılı! (Simülasyon)');
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
            <Typography variant="h5" gutterBottom>Depo Transferi</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    select
                    label="Kaynak Depo"
                    value={kaynakDepo}
                    onChange={e => {
                        setKaynakDepo(e.target.value); 
                        setSonuc('');
                        setErrors({ ...errors, kaynakDepo: undefined });
                    }}
                    error={!!errors.kaynakDepo}
                    helperText={errors.kaynakDepo}
                >
                    {depolar.map(d => (
                        <MenuItem key={d.id} value={d.id}>{d.ad}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Hedef Depo"
                    value={hedefDepo}
                    onChange={e => {
                        setHedefDepo(e.target.value);
                        setSonuc('');
                        setErrors({ ...errors, hedefDepo: undefined });
                    }}
                    error={!!errors.hedefDepo}
                    helperText={errors.hedefDepo}
                >
                    {depolar.map(d => (
                        <MenuItem key={d.id} value={d.id}>{d.ad}</MenuItem>
                    ))}
                </TextField>
                <Autocomplete
                    options={urunler}
                    getOptionLabel={option => option.ad}
                    value={urun}
                    onChange={(_, newValue) => {
                        setUrun(newValue);
                        setSonuc('');
                        setErrors({ ...errors, urun: undefined });
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Ürün Seçimi"
                            error={!!errors.urun}
                            helperText={errors.urun}
                        />
                    )}
                />
                <TextField
                    label="Miktar"
                    type="number"
                    value={miktar}
                    onChange={e => {
                        setMiktar(e.target.value);
                        setSonuc('');
                        setErrors({ ...errors, miktar: undefined });
                    }}
                    inputProps={{ min: 1 }}
                    error={!!errors.miktar}
                    helperText={errors.miktar}
                />
                <Typography color="text.secondary" variant="body2">
                    Stok Durumu: {urun && kaynakDepo ? `Kaynak depoda ${stokDurumu} adet var` : '-'}
                </Typography>
                <Button variant="contained" onClick={handleTransfer}>Transfer Et</Button>
                {sonuc && (
                    <Typography color={sonuc.includes('başarılı') ? 'success.main' : 'error.main'}>
                        {sonuc}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
} 