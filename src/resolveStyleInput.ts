export type Styles =
  | string
  | {
      url?: string;
      path?: string;
      content?: string;
    };

export async function resolveStyleInput(stylesP: Styles | Promise<Styles>) {
  const styles = await stylesP;
  if (typeof styles !== 'string') {
    return styles;
  }

  if (styles.match(/^http/)) {
    return { url: styles };
  } else if (styles.match(/\{/)) {
    return { content: styles };
  }
  return { path: styles };
}
