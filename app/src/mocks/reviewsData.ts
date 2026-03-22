import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'rev-001',
    author: 'María González',
    rating: 5,
    comment: 'El mejor café de Mendoza. El Latte Malbec es una experiencia única que no te podés perder.',
    date: '2026-02-15',
    isApproved: true,
  },
  {
    id: 'rev-002',
    author: 'Juan Pérez',
    rating: 5,
    comment: 'Ambiente increíble, atención impecable y la pastelería es de otro nivel. MUCHÍSIMO recomendado.',
    date: '2026-02-10',
    isApproved: true,
  },
  {
    id: 'rev-003',
    author: 'Lucía Martínez',
    rating: 4,
    comment: 'Me encantó el Dark Brew, perfecto para los días de calor. La terraza es hermosa.',
    date: '2026-02-08',
    isApproved: true,
  },
  {
    id: 'rev-004',
    author: 'Carlos Rodríguez',
    rating: 5,
    comment: 'Vengo todos los fines de semana. El CroqueMUCHO es mi debilidad.',
    date: '2026-02-05',
    isApproved: true,
  },
  {
    id: 'rev-005',
    author: 'Ana Silva',
    rating: 5,
    comment: 'Compré el café en grano para casa y ahora no puedo volver a otro. MUCHO calidad.',
    date: '2026-02-01',
    isApproved: true,
  },
  {
    id: 'rev-006',
    author: 'Pedro López',
    rating: 4,
    comment: 'Excelente atención y productos de primera. El matcha es espectacular.',
    date: '2026-01-28',
    isApproved: true,
  },
  {
    id: 'rev-007',
    author: 'Sofía Herrera',
    rating: 5,
    comment: 'Celebré mi cumpleaños acá y fue perfecto. La torta MUCHÍSIMO es divina.',
    date: '2026-01-25',
    isApproved: true,
  },
  {
    id: 'rev-008',
    author: 'Diego Fernández',
    rating: 5,
    comment: 'Un lugar mágico en el corazón de Mendoza. El café de especialidad que merecemos.',
    date: '2026-01-20',
    isApproved: true,
  },
];

export const pendingReviews: Review[] = [
  {
    id: 'rev-pending-001',
    author: 'Valentina Ruiz',
    rating: 5,
    comment: 'Increíble experiencia, volveré pronto!',
    date: '2026-02-20',
    isApproved: false,
  },
  {
    id: 'rev-pending-002',
    author: 'Martín Castro',
    rating: 4,
    comment: 'Muy bueno todo, aunque tardaron un poco en atendernos.',
    date: '2026-02-19',
    isApproved: false,
  },
];
