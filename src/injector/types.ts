export interface InjectionState {
    instance: any;
}

export interface Injectable {
    name: string;
    obj: any;
    args: any;
    state: InjectionState;
}
