export {};

declare global {
    type NavigationItem ={
        id: string;
        name: string;
        href: string;
        icon: any;
        connectionRequired?: boolean;
    }
  type Navigation = Array<NavigationItem>
}
