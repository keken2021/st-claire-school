import { getAdminTestimonials } from "@/lib/content";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { Card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">
        Testimonials
      </h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Unpublishing a testimonial removes it from the home page and the testimonials page
        immediately.
      </p>

      <ul className="mt-6 space-y-4">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <Card>
              <TestimonialForm
                testimonial={testimonial}
                isVisible={testimonial.isVisible}
                sortOrder={testimonial.sortOrder}
              />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
