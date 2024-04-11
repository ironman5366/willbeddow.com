export async function getServerSideProps(context: any): Promise<{
  props: {};
  redirect?: any;
  notFound?: boolean;
}> {
  const { params } = context;
  // Ensure params.slug is an array
  const slug = params?.slug || [];
  if (!Array.isArray(slug)) {
    throw new Error(`Slug is not an array: ${slug}`);
  }

  if (slug[0] === "page") {
    // Rewrite all "pages" links to "posts" links
    return {
      props: {},
      redirect: {
        destination: `/posts/${slug.slice(1).join("/")}`,
        permanent: true,
      },
    };
  }

  const redirects: { [key: string]: string } = {
    meet: "https://calendly.com/willbeddow",
    ursula: "/posts/ursula",
  };

  const target = redirects[slug.join("/")];

  if (target) {
    return {
      props: {},
      redirect: {
        destination: target,
        permanent: true,
      },
    };
  }

  // If no redirect is found, 404
  return { props: {}, notFound: true };
}

export default function CatchAll() {
  // Unused
  return "Not found";
}
