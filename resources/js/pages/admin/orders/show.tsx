import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { currency } from '@/lib/utils';
import { Order, OrderItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CheckCircle, Clock, MapPin, Package, Truck, User, XCircle, Download, Eye } from 'lucide-react';
import { route } from 'ziggy-js';
import { useState } from 'react';

const breadcrumbs = (transactionNumber: string) => [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Orders', href: route('admin.orders.index') },
    { title: `Order #${transactionNumber}`, href: route('admin.orders.show', { order: transactionNumber }) },
];

const statusStyle: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delivering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    received: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'new':
            return <Clock className="h-4 w-4" />;
        case 'delivering':
            return <Truck className="h-4 w-4" />;
        case 'received':
            return <CheckCircle className="h-4 w-4" />;
        case 'canceled':
            return <XCircle className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

type SortOption = 'default' | 'price-low' | 'price-high' | 'a-z' | 'z-a';

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
    const breadcrumbsArray = breadcrumbs(order.transaction_number.toString());
    const [searchProduct, setSearchProduct] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('default');

    const { data, setData, patch, processing } = useForm({
        order_items: (order.order_items ?? []).map((item: OrderItem) => ({
            id: item.id,
            qty_delivered: item.qty_delivered || item.quantity,
        })),
        status: order.status,
        shipped_at: order.shipped_at || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.orders.update', order.id));
    };

    const updateQtyDelivered = (itemId: number, value: string) => {
        const qtyValue = parseInt(value) || 0;
        const maxQty = order.order_items?.find((it) => it.id === itemId)?.quantity || 0;
        const validatedQty = Math.min(qtyValue, maxQty);

        const updatedItems = (data.order_items || []).map((it: any) => (it.id === itemId ? { ...it, qty_delivered: validatedQty } : it));
        setData('order_items', updatedItems as any);
    };

    const setQtyDeliveredById = (itemId: number, qty: number) => {
        const maxQty = order.order_items?.find((it) => it.id === itemId)?.quantity || 0;
        const validatedQty = Math.min(qty, maxQty);
        const updatedItems = (data.order_items || []).map((it: any) => (it.id === itemId ? { ...it, qty_delivered: validatedQty } : it));
        setData('order_items', updatedItems as any);
    };

    const isDeliverable = order.status === 'new';

    // Hitung subtotal - map by id to avoid ordering issues when filtered/sorted
    const subtotal = (order.order_items ?? []).reduce((sum, orderItem) => {
        const delivered = isDeliverable
            ? data.order_items.find((it: any) => it.id === orderItem.id)?.qty_delivered || 0
            : orderItem.qty_delivered || 0;
        return sum + orderItem.unit_price * orderItem.content * delivered;
    }, 0);

    const tax = Math.round(subtotal * 0.11);
    const total = Math.round(subtotal * 1.11);

    return (
        <AppLayout breadcrumbs={breadcrumbsArray}>
            <Head title={`Order #${order.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header & Status */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                        <p className="text-muted-foreground">
                            View detailed information about order #{order.transaction_number}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge
                            className={`flex items-center gap-1 text-sm ${
                                statusStyle[order.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}
                        >
                            {getStatusIcon(order.status)}
                            {formatStatus(order.status)}
                        </Badge>

                        {order.invoice && (
                            <Button asChild size="sm" variant="outline">
                                <a
                                    href={route('admin.invoices.show', order.invoice.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                >
                                    <Eye className="h-4 w-4" /> Lihat Faktur
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Customer & Order Info */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Customer Information */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-1">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                            <CardDescription>Details about the customer who placed this order</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                                <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                <p className="text-sm font-medium">{order.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Apotek</h4>
                                <p className="text-sm font-medium">{order.user?.apotek?.name || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-1">
                                <Package className="h-5 w-5" />
                                Order Information
                            </CardTitle>
                            <CardDescription>Details about this order</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                                <p className="text-sm font-medium">#{order.id}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Order Date</h4>
                                <p className="text-sm font-medium">{format(new Date(order.created_at), 'MMMM dd, yyyy HH:mm')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Billing Name</h4>
                                <p className="text-sm font-medium">{order.billing_name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Billing Email</h4>
                                <p className="text-sm font-medium">{order.billing_email || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipping Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1">
                            <MapPin className="h-5 w-5" />
                            Shipping Information
                        </CardTitle>
                        <CardDescription>Delivery address for this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Recipient</h4>
                                <p className="text-sm font-medium">{order.shipping_name || order.billing_name || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                                <p className="text-sm font-medium">{order.shipping_address || order.billing_address || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">City/State/ZIP</h4>
                                <p className="text-sm font-medium">
                                    {[order.shipping_city || order.billing_city, order.shipping_state || order.billing_state, order.shipping_zip || order.billing_zip]
                                        .filter(Boolean)
                                        .join(', ') || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                            <CardDescription>Products included in this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex flex-col gap-4 md:flex-row">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by product name..."
                                        value={searchProduct}
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                        className="w-full border-border bg-background text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                                        <SelectTrigger className="w-full border-border bg-background text-foreground">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent className="border-border bg-background text-foreground">
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="a-z">Name: A to Z</SelectItem>
                                            <SelectItem value="z-a">Name: Z to A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <ScrollArea className="h-[400px] w-full">
                                <div className="w-full overflow-x-auto">
                                    <Table className="min-w-[900px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead />
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-center">Satuan</TableHead>
                                            <TableHead className="text-center">Qty Delivered</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(order.order_items ?? [])
                                            .filter((item) => item.product_name?.toLowerCase().includes(searchProduct.toLowerCase()) || searchProduct === '')
                                            .sort((a, b) => {
                                                switch (sortBy) {
                                                    case 'price-low':
                                                        return a.unit_price * a.content - b.unit_price * b.content;
                                                    case 'price-high':
                                                        return b.unit_price * b.content - a.unit_price * a.content;
                                                    case 'a-z':
                                                        return (a.product_name || '').localeCompare(b.product_name || '');
                                                    case 'z-a':
                                                        return (b.product_name || '').localeCompare(a.product_name || '');
                                                    default:
                                                        return 0;
                                                }
                                            })
                                            .map((item: OrderItem) => {
                                                const deliveredObj = (data.order_items || []).find((d: any) => d.id === item.id);
                                                const qtyDelivered = isDeliverable ? (deliveredObj?.qty_delivered ?? 0) : (item.qty_delivered || 0);

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            {item.product?.image ? (
                                                                <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                                                            ) : (
                                                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">No Image</div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-sm font-medium">{item.product_name || 'N/A'}</TableCell>
                                                        <TableCell className="text-right">{currency(item.unit_price * item.content)}</TableCell>
                                                        <TableCell className="text-center">
                                                            {item.quantity} {item.product?.order_unit}
                                                            <br />
                                                            <span className="text-xs text-muted-foreground">({item.quantity * (item.product?.content || 1)} {item.product?.base_uom})</span>
                                                        </TableCell>
                                                        <TableCell>{item.product?.order_unit}</TableCell>
                                                        <TableCell className="text-center">
                                                            {isDeliverable ? (
                                                                <Input type="number" min={0} max={item.quantity} step={1} value={qtyDelivered}
                                                                    onChange={(e) => updateQtyDelivered(item.id, e.target.value)} className="w-20 text-center" />
                                                            ) : (
                                                                <span>{qtyDelivered}</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                                {isDeliverable ? (
                                                                    <div className="flex items-center justify-center">
                                                                        {qtyDelivered > 0 ? (
                                                                            <Button type="button"  size="sm" variant="destructive" onClick={() => setQtyDeliveredById(item.id, 0)}>
                                                                                Exclude
                                                                            </Button>
                                                                        ) : (
                                                                            <Button type="button" size="sm" onClick={() => setQtyDeliveredById(item.id, item.quantity)}>
                                                                                Include
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-muted-foreground">-</span>
                                                                )}
                                                        </TableCell>
                                                        <TableCell className="text-right">{currency(item.unit_price * item.content * qtyDelivered)}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                    </Table>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <div className="mt-4 flex flex-col items-end gap-4">
                        <div className="w-full max-w-sm">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="text-right font-medium">Subtotal:</TableCell>
                                        <TableCell className="text-right font-medium">{currency(subtotal)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-right font-medium">Shipping:</TableCell>
                                        <TableCell className="text-right font-medium">{currency(tax)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-right font-bold">Total:</TableCell>
                                        <TableCell className="text-right font-bold">{currency(total)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex shrink-0 items-center gap-4 py-4">
                            <Button variant="outline" asChild>
                                <Link href={route('admin.orders.index')}>Back to Orders</Link>
                            </Button>

                            {isDeliverable && (
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Mark as Shipped'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
