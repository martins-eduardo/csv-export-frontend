const coin = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

export function formatPrice(cents: number) {
    return coin.format(cents / 100)
}

export function formatData(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR')
}