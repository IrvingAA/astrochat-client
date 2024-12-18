import XDate from 'xdate';

/**
 * Reglas de validación para formularios
 */
export default function useFormRules() {
  /**
   * Requerido
   */
  const required = (v: string | number | boolean | File | any[]): string | true => {
    const message = 'Campo requerido';

    if (v === null || v === undefined) return message;
    if (typeof v === 'boolean') return true;
    if (typeof v === 'number' && v === 0) return true;
    if (Array.isArray(v) && v.length === 0) return message;

    return !!v || message;
  };

  /**
   * Debe ser un archivo o un arreglo de archivos
   */
  const file = (v: any): string | true => {
    if (!v) return true;
    const isArray = v instanceof Array;

    if (isArray) {
      return v.every((file: any) => file instanceof File) || 'Deben ser archivos';
    }

    return v instanceof File || 'Debe ser un archivo';
  };

  /**
   * Debe ser una imagen o un arreglo de imagenes
   */
  const image = (v: any): string | true => {
    if (!v) return true;

    const isArray = v instanceof Array;
    if (isArray) {
      return (
        v.every((file: any) => file instanceof File && file.type.includes('image')) ||
        'Deben ser imágenes'
      );
    }

    return (v instanceof File && v.type.includes('image')) || 'Debe ser una imagen';
  };

  /**
   * Solo letras
   */
  const onlyLetters = (v: string): string | true => {
    if (!v) return true;

    const regExp = /^[a-zA-ZÀ-ÿ\s]*$/;
    return regExp.test(v) || 'Solo puedes ingresar letras';
  };

  /**
   * Solo letras y espacios
   */
  const onlyLettersAndSpaces = (v: string): string | true => {
    if (!v) return true;

    const regExp = /^[a-zA-ZÀ-ÿ\s]*$/;
    return regExp.test(v) || 'Solo puedes ingresar letras y espacios';
  };

  /**
   * Solo caracteres de escritura general (letras, números, espacios y signos de puntuación como .,;:¿?¡!()"-
   */
  const onlyGeneralWritingCharacters = (v: string): string | true => {
    if (!v) return true;

    const regExp = /^[a-zA-ZÀ-ÿ0-9\s.<>',;:*¿?/¡!()@"-_]*$/;
    return (
      regExp.test(v) ||
      'Solo puedes ingresar letras, números, espacios y signos de puntuación como .,;:¿?¡!()"-'
    );
  };

  /**
   * Solo numeros
   */
  const onlyNumbers = (v: string): string | true => {
    const regExp = /^[0-9]*$/;
    return regExp.test(v) || 'Solo puedes ingresar números';
  };

  /**
   * Maximo 5 digitos
   */
  const max5Digits = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^\d{0,5}$/;
    return regExp.test(v) || 'Máximo 5 dígitos';
  };

  /**
   * Al menos 2 caracteres
   */
  const atLeast2Characters = (v: string): string | true => {
    if (!v) return true;

    const regExp = /^.{2,}$/;
    return regExp.test(v) || 'Debe ingresar al menos 2 caracteres';
  };

  /**
   * Solo letras y numeros
   */
  const onlyLettersAndNumbers = (v: string): string | true => {
    if (!v) return true;

    const regExp = /^[a-zA-Z0-9]*$/;
    return regExp.test(v) || 'Solo puedes ingresar letras y números';
  };

  /**
   * CURP (Clave Única de Registro de Población)
   */
  const curp = (v: any): string | true => {
    if (!v) return true;

    const regExp =
      /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    return regExp.test(v) || 'CURP inválido';
  };

  /**
   * RFC (Registro Federal de Contribuyentes)
   */
  const rfc = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^[a-zA-Z]{4}\d{6}[a-zA-Z0-9]{3}$/;
    return regExp.test(v) || 'RFC inválido';
  };

  /**
   * Email (RFC 5322 Official Standard)
   */
  const email = (v: any): string | true => {
    if (!v) return true;

    const regExp =
      /^((?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/;
    return regExp.test(v) || 'Email inválido';
  };

  /**
   * URL (http, https)
   */
  const url = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^(http|https):\/\/[^ "]+$/;
    return regExp.test(v) || 'URL inválida';
  };

  /**
   * Codigo de pais (telefono)
   */
  const countryCodeTel = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^\d{1,3}$/;
    return regExp.test(v) || 'Código de país inválido';
  };

  /**
   * Fecha (input type date: YYYY-MM-DD)
   */
  const date = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^\d{4}-\d{2}-\d{2}$/;
    return regExp.test(v) || 'Fecha inválida';
  };

  /**
   * Fecha anterior a la actual
   */
  const dateBeforeNow = (v: any): string | true => {
    if (!v) return true;

    const dateNow = new XDate().toString('yyyy-MM-dd');
    return v <= dateNow || 'La fecha debe ser igual o anterior a la actual';
  };

  /**
   * Fecha igual o anterior a la actual
   */
  const dateLTEnow = (v: any): string | true => {
    if (!v) return true;

    const dateNow = new XDate().toString('yyyy-MM-dd');
    return v <= dateNow || 'La fecha debe ser igual o anterior a la actual';
  };

  /**
   * Fecha posterior a la actual
   */
  const dateAfterNow = (v: any): string | true => {
    if (!v) return true;

    const dateNow = new XDate().toString('yyyy-MM-dd');
    return v > dateNow || 'La fecha debe ser posterior a la actual';
  };

  /**
   * Fecha igual o posterior a la actual
   */
  const dateGTEnow = (v: any): string | true => {
    if (!v) return true;

    const dateNow = new XDate().toString('yyyy-MM-dd');
    return v >= dateNow || 'La fecha debe ser igual o posterior a la actual';
  };

  /**
   * Código postal (5 dígitos)
   */
  const postalCode = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^\d{5}$/;
    return regExp.test(v) || 'Código postal inválido';
  };

  /**
   * Contraseña (mínimo 8 caracteres, con letras mayúsculas, minúsculas y con al menos un caracter especial)
   */
  const password = (v: any): string | true => {
    if (!v) return true;

    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return (
      regExp.test(v) ||
      'Contraseña inválida, debe tener mínimo 8 caracteres, con letras mayúsculas, minúsculas y con al menos un caracter especial'
    );
  };

  return {
    required,
    file,
    image,
    onlyLetters,
    onlyLettersAndSpaces,
    onlyGeneralWritingCharacters,
    onlyNumbers,
    max5Digits,
    onlyLettersAndNumbers,
    curp,
    rfc,
    email,
    url,
    countryCodeTel,
    date,
    dateLTEnow,
    dateBeforeNow,
    dateAfterNow,
    dateGTEnow,
    postalCode,
    password,
    atLeast2Characters
  };
}
