import { HttpParameterCodec } from "@angular/common/http";

export class CustomEncoder implements HttpParameterCodec {
    encodeKey = (key: string): string => encodeURIComponent(key);

    encodeValue = (value: string): string => encodeURIComponent(value);

    decodeKey = (key: string): string => decodeURIComponent(key);

    decodeValue = (value: string): string => decodeURIComponent(value);
}
