export {};

declare global {
    type NavigationItem ={
        id: string;
        name: string;
        href: string;
        icon: any;
    }
  type Navigation = Array<NavigationItem>
}
