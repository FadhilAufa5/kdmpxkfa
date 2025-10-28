import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Mail, User, FileText, Phone, IdCard } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
    { title: 'Account Management', href: route('admin.account.index') },
];

export default function MappingUsers() {
    const { props }: any = usePage();
    const users = props.users || [];

    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [search, setSearch] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        type: 'approve' | 'reject';
        account: any;
    } | null>(null);
    const [dateFilter, setDateFilter] = useState('');
    const [accountsState, setAccountsState] = useState(users);

    // Filtering
    const filteredAccounts = accountsState.filter((acc: any) => {
        const matchStatus = acc.status === filter;
        const matchName = acc.name.toLowerCase().includes(search.toLowerCase());
        const matchDate = !dateFilter || (acc.created_at && format(new Date(acc.created_at), 'yyyy-MM-dd') === dateFilter);
        return matchStatus && matchName && matchDate;
    });

    const handleConfirm = (type: 'approve' | 'reject', account: any) => {
        const url = `account/${account.id}/${type}`;
        router.post(
            url,
            {},
            {
                onSuccess: () => {
                    setAccountsState((prev: any[]) =>
                        prev.map((acc) => (acc.id === account.id ? { ...acc, status: type === 'approve' ? 'approved' : 'rejected' } : acc)),
                    );
                    setConfirmAction(null);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mapping Users" />

            <div className="flex flex-col gap-10 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage incoming cooperative accounts and continue mapping.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3">
                    {[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' },
                    ].map((s) => (
                        <Button
                            key={s.value}
                            variant={filter === s.value ? 'default' : 'outline'}
                            className={`transition-all duration-200 ${
                                s.value === 'pending'
                                    ? filter === s.value
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                        : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                                    : s.value === 'approved'
                                      ? filter === s.value
                                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                                          : 'border-teal-400 text-teal-600 hover:bg-teal-50'
                                      : filter === s.value
                                        ? 'bg-red-700 text-white hover:bg-red-800'
                                        : 'border-red-400 text-red-700 hover:bg-red-50'
                            }`}
                            onClick={() => setFilter(s.value as any)}
                        >
                            {s.label} ({accountsState.filter((a: any) => a.status === s.value).length})
                        </Button>
                    ))}
                </div>

                {/* Search & Date */}
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Input
                        placeholder="Search by cooperative name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm rounded-full"
                    />
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="rounded-md border px-3 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((acc: any) => (
                            <Card
                                key={acc.id}
                                className="rounded-xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                            >
                                <CardContent className="flex flex-col justify-between gap-4 p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{acc.tenant_name || acc.name}</h3>
                                            <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Mail className="h-4 w-4" />: {acc.email}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                acc.status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                    : acc.status === 'approved'
                                                      ? 'bg-teal-600 text-white'
                                                      : 'bg-red-700 text-white'
                                            }`}
                                        >
                                            {acc.status}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                                            onClick={() => setSelectedAccount(acc)}
                                        >
                                            View Details
                                        </Button>
                                        {acc.status === 'pending' && (
                                            <>
                                                <Button
                                                    className="flex-1 bg-teal-600 text-white transition-all duration-200 hover:bg-teal-700"
                                                    onClick={() => setConfirmAction({ type: 'approve', account: acc })}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-red-700 text-white transition-all duration-200 hover:bg-red-800"
                                                    onClick={() => setConfirmAction({ type: 'reject', account: acc })}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500 dark:text-gray-400">No {filter} accounts found.</p>
                    )}
                </div>
          
           {/* Detail Modal */}
       <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
  <DialogContent className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900">
    {/* Header */}
    <div className="flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-white">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <User className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide">Detail Akun</h2>
          <p className="text-xs text-blue-100">Informasi lengkap akun koperasi</p>
        </div>
      </div>
    </div>


    {selectedAccount && (
      <div className="p-6 space-y-6 text-xs text-gray-700 dark:text-gray-300">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <p><b>Nama:</b> {selectedAccount.name ?? '-'}</p>
          <p><b>Email:</b> {selectedAccount.email ?? '-'}</p>
          <p><b>No Telp:</b> {selectedAccount.phone ?? '-'}</p>
          <p><b>Roles:</b> {selectedAccount.roles?.map((r: any) => r.name).join(', ') || '-'}</p>
          <p><b>Apotek:</b> {selectedAccount.apotek?.name ?? '-'}</p>
          <p><b>Status:</b>{' '}
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                selectedAccount.status === 'approved'
                  ? 'bg-green-100 text-green-600'
                  : selectedAccount.status === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              {selectedAccount.status?.toUpperCase() ?? 'PENDING'}
            </span>
          </p>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <p><b>NIK:</b> {selectedAccount.user_profile_data?.nik ?? '-'}</p>
          <p><b>No. NIB:</b> {selectedAccount.user_profile_data?.nib_number ?? '-'}</p>
          <p><b>No. SIA:</b> {selectedAccount.user_profile_data?.sia_number ?? '-'}</p>
          <p><b>NIK Koperasi:</b> {selectedAccount.tenant_id ?? '-'}</p>
          <p className="sm:col-span-2 mt-4"><b>Alamat:</b> {selectedAccount.user_profile_data?.address ?? '-'}</p>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

     
        <div>
          <h3 className="mb-4 text-sm font-semibold text-orange-600 dark:text-orange-400">Dokumen</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'KTP', file: selectedAccount.user_profile_data?.ktp_file },
              { label: 'NIB', file: selectedAccount.user_profile_data?.nib_file },
              { label: 'NPWP', file: selectedAccount.user_profile_data?.npwp_file },
              { label: 'SIA', file: selectedAccount.user_profile_data?.sia_file },
            ].map((doc, i) => (
              <div key={i} className="text-center">
                <p className="mb-1 text-[11px] font-medium text-gray-700 dark:text-gray-300">{doc.label}</p>
                {doc.file ? (
                  doc.file.endsWith('.pdf') ? (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center h-24 rounded-lg border border-gray-200 bg-gray-50 hover:scale-105 hover:shadow-md transition-transform dark:border-gray-700 dark:bg-gray-800"
                    >
                      <FileText className="h-5 w-5 text-orange-500" />
                      <span className="text-[10px] text-gray-700 mt-1">Lihat PDF</span>
                    </a>
                  ) : (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-lg border border-gray-200 hover:scale-105 hover:shadow-lg transition-transform dark:border-gray-700"
                    >
                      <img
                        src={doc.file}
                        alt={`${doc.label} Preview`}
                        className="h-24 w-full object-cover"
                      />
                    </a>
                  )
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 dark:border-gray-600">
                    <span className="text-[10px]">Tidak ada file</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


                {/* Confirm Modal */}
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    {confirmAction && (
                        <DialogContent className="max-w-md rounded-xl p-6 dark:border-gray-700 dark:bg-gray-900">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">
                                    Konfirmasi {confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
                                </DialogTitle>
                            </DialogHeader>
                            <p className="mt-2">
                                Apakah Anda yakin ingin <b>{confirmAction.type === 'approve' ? 'Menyetujui' : 'Menolak'}</b> akun{' '}
                                <b>{confirmAction.account.name}</b>?
                            </p>
                            <DialogFooter className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                                    onClick={() => setConfirmAction(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className={`${
                                        confirmAction.type === 'approve'
                                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                                            : 'bg-red-700 text-white hover:bg-red-800'
                                    } transition-all duration-200`}
                                    onClick={() => handleConfirm(confirmAction.type, confirmAction.account)}
                                >
                                    Ya, {confirmAction.type === 'approve' ? 'Setujui' : 'Tolak'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </AppLayout>
    );
}
