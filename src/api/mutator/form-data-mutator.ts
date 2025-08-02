export const customFormData = <Body extends Record<string, any>>(
  body: Body,
): FormData => {
  const formData = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.filter(e => e).forEach((v) => {
        if (typeof v === 'string') {
          formData.append(key, v);
        }else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(v));
        }else{
          formData.append(key, v);
        }
      });
    } else {
      if (value != null)
        formData.append(key, value);
    }
  });

  return formData;
};

export default customFormData;
