import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone, Check, AlertCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

// Time slots
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

// Guest options
const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

// Validation function
const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!data.phone.trim()) {
    errors.phone = 'El teléfono es requerido';
  } else if (!/^\+?[\d\s-]{8,}$/.test(data.phone)) {
    errors.phone = 'Ingresá un teléfono válido';
  }

  if (!data.date) {
    errors.date = 'Seleccioná una fecha';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = 'La fecha no puede ser anterior a hoy';
    }
  }

  if (!data.time) {
    errors.time = 'Seleccioná un horario';
  }

  if (!data.guests) {
    errors.guests = 'Seleccioná la cantidad de personas';
  }

  return errors;
};

const Reservas: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  }, [formData]);

  const handleReset = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
    });
    setErrors({});
    setIsSuccess(false);
  }, []);

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <section className="py-16 md:py-24">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A2F] font-['Playfair_Display'] mb-4">
                ¡Reserva recibida!
              </h2>
              <p className="text-[#1B3A2F]/70 mb-8">
                Gracias {formData.name}. Hemos recibido tu solicitud de reserva para el{' '}
                {new Date(formData.date + 'T12:00:00').toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })} a las {formData.time}.
                Te contactaremos por teléfono para confirmar.
              </p>
              <Button onClick={handleReset} className="bg-[#1B3A2F] hover:bg-[#2D4A3E]">
                Hacer otra reserva
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1B3A2F] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
              Reservá tu Mesa
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Reservá con anticipación y asegurate tu lugar en MUCHO Café.
              Te esperamos con MUCHO gusto.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1B3A2F]">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej: María González"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1B3A2F]">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Ej: +54 9 261 700-3657"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#1B3A2F]">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[#1B3A2F]">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horario
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                    <SelectTrigger className={errors.time ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-[#1B3A2F]">
                  <Users className="w-4 h-4 inline mr-2" />
                  Cantidad de personas
                </Label>
                <Select value={formData.guests} onValueChange={(value) => handleChange('guests', value)}>
                  <SelectTrigger className={errors.guests ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map((num) => (
                      <SelectItem key={num} value={num}>
                        {num} {num === '1' ? 'persona' : 'personas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guests && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.guests}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B3A2F] hover:bg-[#2D4A3E] py-6 text-lg"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>

              <Alert className="bg-[#E8DDD4] border-[#C4A77D]">
                <AlertDescription className="text-sm text-[#1B3A2F]/70">
                  Las reservas están sujetas a disponibilidad. Te contactaremos para confirmar.
                  Para grupos mayores a 10 personas, por favor contactanos directamente.
                </AlertDescription>
              </Alert>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Reservas;
