import { getAdminTestimonials } from "@/lib/content";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { Card, HelpBox, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <PageHeader
        title="Parent Reviews"
        description="These are the quotes families see on the home page and the Reviews page. Edit the text, then press Save review on each card."
      />

      <HelpBox title="How to hide a review">
        Uncheck &ldquo;Show this review on the website&rdquo; and save — it disappears from the
        site immediately but stays here so you can turn it back on later.
      </HelpBox>

      <ul className="mt-8 space-y-6">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <Card>
              <p className="mb-5 text-lg font-semibold text-ink">{testimonial.name}</p>
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
