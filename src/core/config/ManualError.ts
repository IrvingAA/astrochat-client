import HttpStatusEnum from '@/core/enums/HttpStatusEnum';
import type { NormalizeDataIC } from '@/core/types/config/CustomHandlerInterface';
import XDate from 'xdate';

export default class ManualError extends Error {
  /**
   * Fecha y hora del error
   */
  public dateTime: string;

  /**
   * Codigo de error http
   */
  public httpCode: number;

  /**
   * Alerta de error
   */
  public alert: NormalizeDataIC['alert'];

  /**
   * Titulo de error
   */
  public title: string;

  /**
   * Mensaje de error
   */
  public message: string;

  /**
   * Datos del error
   */
  public data: any | null;

  /**
   * Contructor de la clase
   */
  constructor(
    message: string,
    title = 'Error',
    httpCode: number = HttpStatusEnum.INTERNAL_SERVER_ERROR,
    alert: NormalizeDataIC['alert'] = 'negative',
    data: any | null = null
  ) {
    super(message);

    this.dateTime = new XDate().toString('yyyy-MM-dd HH:mm:ss');
    this.httpCode = httpCode;
    this.alert = alert;
    this.title = title;
    this.message = message;
    this.data = data;
  }
}
