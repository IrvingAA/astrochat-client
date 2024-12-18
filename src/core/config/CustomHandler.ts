import HttpStatusEnum from '@/core/enums/HttpStatusEnum';
import ManualError from '@/core/config/ManualError';
import { AxiosError } from 'axios';
import type {
  NormalizeDataIC,
  AxiosReturnDataIC
} from '@/core/types/config/CustomHandlerInterface';
import type { ApiErrorResponseIC } from '@/core/types/api/ApiType';
import XDate from 'xdate';

export default class CustomHandler extends Error {
  /**
   * Datos del error
   */
  //@ts-ignore
  public data: NormalizeDataIC;

  /**
   * Constructor de la clase
   */
  constructor(error: Error) {
    super(error.message);

    let dateTime: string = new XDate().toString('yyyy-MM-dd HH:mm:ss');
    let from: NormalizeDataIC['from'] = 'unknown';
    let httpCode: number = HttpStatusEnum.INTERNAL_SERVER_ERROR;
    let title = 'Error desconocido';
    let message: string = error.message;
    let alert: NormalizeDataIC['alert'] = 'negative';
    let data: any | null = error;

    if (error instanceof AxiosError) {
      // Si el error es de axios
      const axiosDataError = this.axios(error);
      from = 'axios';
      dateTime = axiosDataError.dateTime;
      httpCode = axiosDataError.httpCode;
      alert = axiosDataError.alert;
      title = axiosDataError.title;
      message = axiosDataError.message;
      data = axiosDataError.data;
    } else if (error instanceof ManualError) {
      // Si el error es manual
      from = 'manual';
      dateTime = error.dateTime;
      httpCode = error.httpCode;
      alert = error.alert;
      title = error.title;
      message = error.message;
      data = error.data;
    } else if (error instanceof CustomHandler) {
      // Si el error proviene de otro CustomHandler
      from = error.data.from;
      dateTime = error.data.dateTime;
      httpCode = error.data.httpCode;
      alert = error.data.alert;
      title = error.data.title;
      message = error.data.message;
      data = error.data.data;
    }

    this.setData({
      from,
      dateTime,
      httpCode,
      alert,
      title,
      message,
      data
    });
  }

  /**
   * Setea los datos del error
   */
  private setData(args: NormalizeDataIC): void {
    this.data = {
      from: args.from,
      dateTime: args.dateTime,
      httpCode: args.httpCode,
      alert: args.alert,
      title: args.title,
      message: args.message,
      data: args?.data
    };
  }

  /**
   * Obtener los datos del error de axios
   */
  private axios(error: AxiosError): AxiosReturnDataIC {
    const defaultMsg = 'Ocurrió un error al intentar conectar con el servidor';

    let dateTime: string = new XDate().toString('yyyy-MM-dd HH:mm:ss');
    let httpCode: number = HttpStatusEnum.INTERNAL_SERVER_ERROR;
    let title: string | null = 'Error';
    let message: string | null = defaultMsg;
    let alert: NormalizeDataIC['alert'] = 'negative';
    let data: any | null = null;

    if (!error.response) return { dateTime, httpCode, alert, title, message, data };

    const response = error.response;
    httpCode = response.status;

    if (!response.data) return { dateTime, httpCode, alert, title, message, data };

    const axiosData = response.data as ApiErrorResponseIC;
    dateTime = axiosData.dateTime;
    alert = axiosData.alert;
    title = axiosData.title;
    message = axiosData.message;
    data = axiosData.data;

    return {
      dateTime,
      httpCode,
      alert,
      title,
      message,
      data
    };
  }

  /**
   * Retorna true si el error es un 422 Unprocessable Entity
   */
  public isUnprocessableEntity(): boolean {
    return this.data.httpCode === HttpStatusEnum.UNPROCESSABLE_ENTITY;
  }
}
